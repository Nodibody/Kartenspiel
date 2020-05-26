import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { FirestoreSession, Session } from '../modelle/Session';
import { CardService } from './card.service';
import { KartenTyp } from '../modelle/KartenTyp';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public sessionId: string;
  constructor(
    private afs: AngularFirestore,
    private cardService: CardService
  ) {}

  /*
  createSession(): Observable<FirestoreSession> {
    return new Observable<FirestoreSession>((observer) => {
      let FirestoreSession: FirestoreSession = {
        sessionId: `${Math.floor(Math.random() * Math.pow(10, 9))}`,
      };
      this.sessionsCollection.add(FirestoreSession);
      observer.next(FirestoreSession);
      observer.complete();
    });
  }

  sessionExists(sessionId: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.sessions.subscribe((sessions) => {
        for (let FirestoreSession of sessions) {
          if (FirestoreSession.sessionId === sessionId) {
            observer.next(true);
            observer.complete();
          }
        }
      });
    });
  }
  */

  public createSession(playerName: string): Observable<Session> {
    return new Observable<Session>((observer) => {
      this.sessionsCollection.add({ players: [playerName] }).then((ref) => {
        this.sessionId = ref.id;
        observer.next({ sessionId: ref.id });
        this.waitForFullSession(ref.id);
        observer.complete();
      });
    });
  }

  public joinSession(
    sessionId: string,
    playerName: string
  ): Observable<Session> {
    return new Observable<Session>((observer) => {
      const doc = this.sessionsCollection.doc<FirestoreSession>(sessionId);
      const sub = doc.valueChanges().subscribe((session) => {
        sub.unsubscribe();
        if (!session) {
          throw new Error('Session unavailable!');
        }
        this.sessionId = sessionId;
        doc.update({ players: [playerName, ...session.players] });
        const sub2 = doc.valueChanges().subscribe((s) => {
          console.log(s.players);
          sub2.unsubscribe();
          observer.next({ sessionId, ...s });
          observer.complete();
        });
      });
    });
  }

  private sendCardsToServer(cards: KartenTyp[][]) {
    const doc = this.sessionsCollection.doc<FirestoreSession>(this.sessionId);
    const sub = doc.valueChanges().subscribe((session) => {
      sub.unsubscribe();
      doc.update({
        cards: session.players.map((player, i) => {
          return { name: player, cards: cards[i] };
        }),
      });
    });
  }

  private waitForFullSession(sessionId: string) {
    const sub = this.sessionsCollection
      .doc<FirestoreSession>(sessionId)
      .valueChanges()
      .subscribe((session) => {
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
      const sub = this.sessionsCollection
        .doc<FirestoreSession>(this.sessionId)
        .valueChanges()
        .subscribe((session) => {
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

  get sessionsCollection(): AngularFirestoreCollection<FirestoreSession> {
    return this.afs.collection<FirestoreSession>('sessions');
  }
  get sessions(): Observable<FirestoreSession[]> {
    return this.sessionsCollection.valueChanges();
  }
}
