import { Component, OnInit } from '@angular/core';
import { KartenTyp } from '../modelle/KartenTyp';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit {
  karten: KartenTyp[];

  constructor() {
    this.karten = [
      { color: 'Herz', levelString: 'König', level: 1 },
      { color: 'Herz', levelString: 'Achter', level: 2 },
      { color: 'Herz', levelString: 'Neuner', level: 3 },
      { color: 'Herz', levelString: 'Zehner', level: 4 },
      { color: 'Eichel', levelString: 'Sau', level: 5 },
    ];
  }

  ngOnInit(): void {}

  benutzeKarte(karte) {
    this.karten = this.karten.filter((k) => k !== karte);
  }
}
