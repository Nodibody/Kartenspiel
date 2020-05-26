import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';
@Component({
  selector: 'app-firestore-test',
  templateUrl: './firestore-test.component.html',
  styleUrls: ['./firestore-test.component.css'],
})
export class FirestoreTestComponent implements OnInit {
  items: Observable<any[]>;
  info: any;
  id: string;
  name = '0';

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.sessionService.joinSession(this.id, this.name).subscribe((session) => {
      this.sessionService.getCards(this.name).subscribe(console.log);
    });
  }

  createSession() {
    this.sessionService.createSession(this.name).subscribe((session) => {
      this.info = session.sessionId;
      this.sessionService.getCards(this.name).subscribe(console.log);
    });
  }
}
