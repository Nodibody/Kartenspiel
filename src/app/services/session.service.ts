import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable, Subject, forkJoin, from, of } from 'rxjs';
import { Session } from '../modelle/Session';
import { CardService } from './card.service';
import { KartenTyp, PlayedCardType } from '../modelle/KartenTyp';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public sessionId: string;
  private roundNo: number = 0;
  private players: Subject<number> = new Subject<number>();

  constructor(
    private afs: AngularFirestore,
    private cardService: CardService
  ) {}
  //Host 0
  public createSession(playerId: string): Observable<Session> {
    return new Observable<Session>((observer) => {
      this.sessionsCollection
        .add({ players: [playerId], nextPlayer: playerId })
        .then((ref) => {
          this.sessionId = ref.id;
          observer.next({ sessionId: ref.id });
          this.waitForFullSession();
          observer.complete();
        });
    });
  }
  //Host 1
  private waitForFullSession() {
    console.log('Waiting for full session...');
    const sub = this.doc.valueChanges().subscribe((session) => {
      this.players.next(session.players.length);
      if (session.players.length < 4) {
        return;
      }
      sub.unsubscribe();
      this.startNewRound();
    });
  }
  //Host 2
  public startNewRound(): void {
    of(++this.roundNo)
      .pipe(
        map((roundNo) => {
          switch (roundNo) {
            case 1:
              return from(
                this.doc.update({ roundNo: this.roundNo, round1: [] })
              );
            case 2:
              return from(
                this.doc.update({ roundNo: this.roundNo, round2: [] })
              );
            case 3:
              return from(
                this.doc.update({ roundNo: this.roundNo, round3: [] })
              );
            case 4:
              return from(
                this.doc.update({ roundNo: this.roundNo, round4: [] })
              );
            case 5:
              return from(
                this.doc.update({ roundNo: this.roundNo, round5: [] })
              );
          }
        })
      )
      .subscribe(() => this.sendCardsToServer(this.cardService.drawAllCards()));
  }
  //Host 3
  private sendCardsToServer(cards: KartenTyp[][]) {
    this.session
      .pipe(
        switchMap((session) =>
          from(
            this.doc.update({
              cards: session.players.map((player, i) => {
                return { name: player, cards: cards[i] };
              }),
            })
          )
        )
      )
      .subscribe(() => {});
  }

  //Client 0 | not Host
  public joinSession(
    sessionId: string,
    playerId: string
  ): Observable<Session | Error> {
    this.sessionId = sessionId;
    return this.session.pipe(
      map((session) => {
        if (!session || !session?.players || session?.players?.length >= 4) {
          throw new Error(`Session unavailable! (${sessionId})`);
        }
        session.players.push(playerId);
        this.doc.update({ players: session.players });
        this.players.next(session.players.length);
        return session;
      })
    );
  }
  //Client 1
  public getCards(id: string): Observable<KartenTyp[]> {
    return new Observable<KartenTyp[]>((observer) => {
      const sub = this.doc.valueChanges().subscribe((session) => {
        if (!session.cards) {
          console.log('No cards yet!');
          return;
        }
        sub.unsubscribe();
        observer.next(session.cards.filter((v) => v.name === id)[0].cards);
        observer.complete();
      });
    });
  }
  //Client 2
  public isNextPlayer(id: string): Observable<boolean> {
    return this.session.pipe(map((session) => session.nextPlayer === id));
  }
  //Client 3
  public sendPlayedCard(card: KartenTyp, id: string) {
    forkJoin(this.session, this.nextPlayer).subscribe((data) => {
      const session: Session = data[0];
      const nextPlayer: string = data[1];
      const playedCard: PlayedCardType = { player: id, ...card };
      switch (session.roundNo) {
        case 1:
          return from(
            this.doc.update({
              round1: [playedCard, ...session.round1],
              nextPlayer,
            })
          );
        case 2:
          return from(
            this.doc.update({
              round2: [playedCard, ...session.round2],
              nextPlayer,
            })
          );
        case 3:
          return from(
            this.doc.update({
              round3: [playedCard, ...session.round3],
              nextPlayer,
            })
          );
        case 4:
          return from(
            this.doc.update({
              round4: [playedCard, ...session.round4],
              nextPlayer,
            })
          );
        case 5:
          return from(
            this.doc.update({
              round5: [playedCard, ...session.round5],
              nextPlayer,
            })
          );
      }
    });
  }

  get sessionsCollection(): AngularFirestoreCollection<Partial<Session>> {
    return this.afs.collection<Partial<Session>>('sessions');
  }
  get sessions(): Observable<Partial<Session>[]> {
    return this.sessionsCollection.valueChanges();
  }
  get doc(): AngularFirestoreDocument<Partial<Session>> {
    return this.sessionsCollection.doc<Partial<Session>>(this.sessionId);
  }
  get session(): Observable<Session> {
    return this.doc.get().pipe(
      map((snap) => {
        return { sessionId: snap.id, ...snap.data() };
      })
    );
  }
  public get playerCount(): Observable<number> {
    return this.doc
      .valueChanges()
      .pipe(map((session) => session.players?.length));
  }
  private get nextPlayer(): Observable<string> {
    return this.doc.get({ source: 'cache' }).pipe(
      map((snap) => snap.data()),
      map((session) => {
        let currentPlayer = session.players.findIndex(
          (player) => player === session.nextPlayer
        );
        if (currentPlayer++ >= session.players.length) {
          currentPlayer = 0;
        }
        return session.players[currentPlayer];
      })
    );
  }
}
