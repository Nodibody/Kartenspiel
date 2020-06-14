import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { SessionService } from './services/session.service';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { first, switchMap, map, catchError } from 'rxjs/operators';
import { Session } from './modelle/Session';
import { MatDialog } from '@angular/material/dialog';
import { DialogSessionUnavailableComponent } from './dialogs/dialog-session-unavailable/dialog-session-unavailable.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Kartenspiel';
  sessionId: string;
  host = false;
  testing: boolean;
  constructor(
    private route: ActivatedRoute,
    public afAuth: AngularFireAuth,
    public sessionService: SessionService,
    private router: Router,
    private location: Location,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.afAuth.signOut();
    this.route.queryParams.subscribe((params) => {
      if (params.logout) this.afAuth.signOut();
      this.testing = params.testing;
      this.host = params.host;
      if (params.session) {
        this.joinSession(params.session, true);
      }
    });
  }

  isLoggedIn() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async signIn() {
    // if (!(await this.isLoggedIn())) {
    // return this.afAuth.signInWithPopup(
    //   new firebase.auth.GoogleAuthProvider()
    // );
    // }
    return this.afAuth.signInAnonymously();
  }

  async createSession() {
    this.host = true;
    console.log((await this.signIn()).user.uid);
    this.uuid
      .pipe(switchMap((token) => this.sessionService.createSession(token)))
      .subscribe(({ sessionId }) => {
        this.sessionId = sessionId;
        this.location.replaceState(`?session=${sessionId}`);
      });
  }

  async joinSession(sessionId: string, fromParam: boolean = false) {
    if (!sessionId) return;
    if (!fromParam) this.router.navigateByUrl(`?session=${sessionId}`);
    console.log((await this.signIn()).user.uid);
    this.host = false;
    this.uuid
      .pipe(
        switchMap((token) => this.sessionService.joinSession(sessionId, token)),
        catchError((err) => {
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.matDialog
            .open(DialogSessionUnavailableComponent)
            .afterClosed()
            .subscribe(async () => {
              await this.router.navigateByUrl('');
              location.reload();
            });
          throw err;
        })
      )
      .subscribe((session: Session) => (this.sessionId = session.sessionId));
  }

  public get uuid(): Observable<string> {
    return this.afAuth.user?.pipe(map((user) => user.uid));
  }
}
