import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-firestore-test',
  templateUrl: './firestore-test.component.html',
  styleUrls: ['./firestore-test.component.css'],
})
export class FirestoreTestComponent implements OnInit {
  items: Observable<any[]>;
  exists;
  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.items = this.sessionService.sessions;
    this.sessionService.createSession().subscribe((session) => {
      this.exists = session.sessionId;
    });
  }
}
