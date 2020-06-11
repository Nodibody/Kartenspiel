import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';
import { SiegerauswertungService } from '../services/siegerauswertung.service';
import { PlayedCardType, KartenTyp } from '../modelle/KartenTyp';
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
  joined: boolean;

  constructor(
    private sessionService: SessionService,
    private siegerauswertungService: SiegerauswertungService
  ) {
    let cards: PlayedCardType[] = [
      { color: 'Herz', levelString: 'Siebener', level: 1, player: '0' },
      { color: 'Herz', levelString: 'Zehner', level: 4, player: '3' },
      { color: 'Herz', levelString: 'Achter', level: 2, player: '1' },
      { color: 'Herz', levelString: 'Neuner', level: 5, player: '2' },
    ];
    let rechter: KartenTyp = { color: 'Herz', levelString: 'Unter', level: 5 };
    this.info = siegerauswertungService.getWinner(cards, rechter);
  }

  ngOnInit(): void {}

  onSubmit() {
    this.sessionService.joinSession(this.id, this.name).subscribe((session) => {
      this.sessionService.getCards(this.name).subscribe(console.log);
    });
    // this.sessionService.sendPlayedCard(
    //   {
    //     color: 'Laub',
    //     levelString: 'Sau',
    //     level: 8,
    //   },
    //   this.name
    // );
  }

  createSession() {
    this.sessionService.createSession(this.name).subscribe((session) => {
      this.info = session.sessionId;
      this.sessionService.getCards(this.name).subscribe(console.log);
      this.sessionService.startNewRound();
    });
  }
}
