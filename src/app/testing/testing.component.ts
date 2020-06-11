import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css'],
})
export class TestingComponent implements OnInit {
  constructor(public afAuth: AngularFireAuth) {}

  ngOnInit(): void {}

  logInWithGoogle() {
    console.log('logging in...');
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logOut() {
    console.log('logging out...');
    this.afAuth.signOut();
  }
}
