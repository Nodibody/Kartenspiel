import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { Observable, of, observable } from 'rxjs';
import { JsonPipe } from '@angular/common';

export interface Session {
  sessionId: string;
}
@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private afs: AngularFirestore) {}

  createSession(): Observable<Session> {
    return new Observable<Session>((observer) => {
      let session: Session = {
        sessionId: `${Math.floor(Math.random() * Math.pow(10, 9))}`,
      };
      this.sessionsCollection.add(session);
      observer.next(session);
      observer.complete();
    });
  }

  sessionExists(sessionId: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.sessions.subscribe((sessions) => {
        for (let session of sessions) {
          if (session.sessionId === sessionId) {
            observer.next(true);
            observer.complete();
          }
        }
      });
    });
  }

  get sessionsCollection(): AngularFirestoreCollection {
    return this.afs.collection('sessions');
  }
  get sessions(): Observable<any[]> {
    return this.sessionsCollection.valueChanges();
  }
}
