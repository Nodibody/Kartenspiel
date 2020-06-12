import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KartenTyp } from '../modelle/KartenTyp';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit {
  @Input() karten: KartenTyp[];
  @Input() isNextPlayer: boolean;
  @Output() useCard: EventEmitter<KartenTyp> = new EventEmitter<KartenTyp>();
  constructor() {}

  ngOnInit(): void {}

  benutzeKarte(karte) {
    console.log(this.isNextPlayer);
    if (!this.isNextPlayer) return;
    this.karten = this.karten.filter((k) => k !== karte);
    this.useCard.emit(karte);
  }
}
