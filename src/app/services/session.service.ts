import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentReference,
} from '@angular/fire/firestore';
import { Observable, Subject, forkJoin, from, of, BehaviorSubject } from 'rxjs';
import { Session, CardType, Color } from '../modelle/Session';
import { CardService } from './card.service';
import { map, switchMap, filter, pluck, tap } from 'rxjs/operators';
import { subscribeOnce } from '../rxjs-operators/operators';
import { SiegerauswertungService } from './siegerauswertung.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public sessionId: string;
  private roundNo = 0;
  private players: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private afs: AngularFirestore,
    private cardService: CardService,
    private siegerauswertungService: SiegerauswertungService
  ) {}
  // Host 0
  public createSession(playerId: string): Observable<Session> {
    return from(
      this.sessionsCollection.add({ players: [playerId], nextPlayer: playerId })
    ).pipe(
      tap((ref: DocumentReference) => (this.sessionId = ref.id)),
      map(({ id }) => {
        this.waitForFullSession();
        return { sessionId: id };
      })
    );
  }
  // Host 1
  private waitForFullSession() {
    console.log('Waiting for full session...');
    this.doc
      .valueChanges()
      .pipe(
        tap(({ players }) => this.players.next(players.length)),
        filter(({ players }) => players.length >= 4),
        subscribeOnce(() => this.startNewRound())
      )
      .subscribe()
      .unsubscribe();
  }
  // Host 2
  public startNewRound(): void {
    of(++this.roundNo)
      .pipe(
        switchMap((roundNo) => {
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
        }),
        subscribeOnce(() =>
          this.sendCardsToServer(this.cardService.drawAllCards())
        )
      )
      .subscribe()
      .unsubscribe();
  }
  // Host 3
  private sendCardsToServer(cards: CardType[][]) {
    this.session.subscribe((session) =>
      this.doc.update({
        cards: session.players.map((player, i) => {
          return { name: player, cards: cards[i] };
        }),
      })
    );
  }
  // Host 4
  public waitForFullRound(): Observable<string> {
    return this.doc.valueChanges().pipe(
      filter((session) => session[`round${this.roundNo}`].length === 4),
      map((session) =>
        this.siegerauswertungService.getWinner(
          session[`round${this.roundNo}`],
          session.rechter
        )
      )
    );
  }

  // Client 0 | not Host
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
  // Client 1
  public getCards(id: string): Observable<CardType[]> {
    return this.doc.valueChanges().pipe(
      filter((session) => !!session?.cards),
      map(({ cards }) => cards.filter((v) => v.name === id)[0].cards)
    );
  }
  public sendLevel(level: number) {
    this.doc.update({ rechter: { level } });
  }
  public sendColor(color: Color) {
    this.session
      .pipe(
        // map(({ rechter }) => rechter),
        filter(({ rechter: { level } }) => level !== undefined),
        subscribeOnce(({ rechter: { level } }) => {
          this.doc.update({ rechter: this.cardService.getCard(color, level) });
        })
      )
      .subscribe()
      .unsubscribe();
  }
  // Client 2
  public waitForRechter(): Observable<Partial<CardType>> {
    return this.doc.valueChanges().pipe(
      filter(
        ({ rechter }) =>
          !!(
            rechter &&
            rechter?.color &&
            rechter?.level &&
            rechter?.levelString
          )
      ),
      map(({ rechter }) => rechter)
    );
  }
  // Client 3
  public isNextPlayer(id: string): Observable<boolean> {
    return this.doc
      .valueChanges()
      .pipe(map(({ nextPlayer }) => nextPlayer === id));
  }
  // Client 4
  public sendPlayedCard(card: CardType, id: string) {
    forkJoin([this.session, this.nextPlayer]).subscribe(
      ([session, nextPlayer]) => {
        const playedCard: CardType = { player: id, ...card };
        const data: Partial<Session> = { nextPlayer };
        data[`round${session.roundNo}`] = [
          playedCard,
          ...session[`round${session.roundNo}`],
        ];
        return from(this.doc.update(data));
      }
    );
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
      map((session: Partial<Session>) => {
        let currentPlayer = session.players.findIndex(
          (player) => player === session.nextPlayer
        );
        if (++currentPlayer >= session.players.length) {
          currentPlayer = 0;
        }
        return session.players[currentPlayer];
      })
    );
  }
}
