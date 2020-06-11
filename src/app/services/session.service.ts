import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { FirestoreSession, Session } from '../modelle/Session';
import { CardService } from './card.service';
import { KartenTyp, PlayedCardType } from '../modelle/KartenTyp';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public sessionId: string;
  private roundNo: number = 0;
  constructor(
    private afs: AngularFirestore,
    private cardService: CardService
  ) {}

  public createSession(playerName: string): Observable<Session> {
    return new Observable<Session>((observer) => {
      this.sessionsCollection.add({ players: [playerName] }).then((ref) => {
        this.sessionId = ref.id;
        observer.next({ sessionId: ref.id });
        observer.complete();
        this.waitForFullSession(ref.id);
      });
    });
  }

  public joinSession(
    sessionId: string,
    playerName: string
  ): Observable<Session> {
    return new Observable<Session>((observer) => {
      const sub = this.sessionsCollection
        .doc<FirestoreSession>(this.sessionId)
        .valueChanges()
        .subscribe((session) => {
          sub.unsubscribe();
          if (!session) {
            throw new Error('Session unavailable!');
          }
          this.sessionId = sessionId;
          this.doc.update({ players: [playerName, ...session.players] });
          const sub2 = this.doc.valueChanges().subscribe((s) => {
            console.log(s.players);
            sub2.unsubscribe();
            observer.next({ sessionId, ...s });
            observer.complete();
          });
        });
    });
  }

  private sendCardsToServer(cards: KartenTyp[][]) {
    const sub = this.doc.valueChanges().subscribe((session) => {
      sub.unsubscribe();
      this.doc.update({
        cards: session.players.map((player, i) => {
          return { name: player, cards: cards[i] };
        }),
      });
    });
  }

  private waitForFullSession(sessionId: string) {
    const sub = this.doc.valueChanges().subscribe((session) => {
      console.log(session.players);
      if (session.players.length !== 4) {
        return;
      }
      sub.unsubscribe();
      this.sendCardsToServer(this.cardService.drawAllCards());
    });
  }

  public getCards(name: string): Observable<KartenTyp[]> {
    return new Observable<KartenTyp[]>((observer) => {
      const sub = this.doc.valueChanges().subscribe((session) => {
        if (!session.cards) {
          console.log('No cards yet!');
          return;
        }
        sub.unsubscribe();
        observer.next(session.cards.filter((v) => v.name === name)[0].cards);
        observer.complete();
      });
    });
  }

  public startNewRound(): void {
    this.roundNo++;
    switch (this.roundNo) {
      case 1:
        this.doc.update({ roundNo: this.roundNo, round1: [] });
        break;
      case 2:
        this.doc.update({ roundNo: this.roundNo, round2: [] });
        break;
      case 3:
        this.doc.update({ roundNo: this.roundNo, round3: [] });
        break;
      case 4:
        this.doc.update({ roundNo: this.roundNo, round4: [] });
        break;
      case 5:
        this.doc.update({ roundNo: this.roundNo, round5: [] });
        break;
    }
  }
  public sendPlayedCard(card: KartenTyp, name: string) {
    const sub = this.doc.valueChanges().subscribe((session) => {
      sub.unsubscribe();
      const playedCard: PlayedCardType = { player: name, ...card };

      switch (session.roundNo) {
        case 1:
          this.doc.update({ round1: [playedCard, ...session.round1] });
          break;
        case 2:
          this.doc.update({ round2: [playedCard, ...session.round2] });
          break;
        case 3:
          this.doc.update({ round3: [playedCard, ...session.round3] });
          break;
        case 4:
          this.doc.update({ round4: [playedCard, ...session.round4] });
          break;
        case 5:
          this.doc.update({ round5: [playedCard, ...session.round5] });
          break;
      }
    });
  }

  get sessionsCollection(): AngularFirestoreCollection<FirestoreSession> {
    return this.afs.collection<FirestoreSession>('sessions');
  }
  get sessions(): Observable<FirestoreSession[]> {
    return this.sessionsCollection.valueChanges();
  }
  get doc(): AngularFirestoreDocument<FirestoreSession> {
    return this.sessionsCollection.doc<FirestoreSession>(this.sessionId);
  }
}
