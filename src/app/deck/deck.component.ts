import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CardType } from '../modelle/Session';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit {
  @Input() karten: CardType[];
  @Input() isNextPlayer: boolean;
  @Output() useCard: EventEmitter<CardType> = new EventEmitter<CardType>();
  constructor() {}

  ngOnInit(): void {}

  benutzeKarte(karte) {
    console.log(this.isNextPlayer);
    if (!this.isNextPlayer) return;
    this.useCard.emit(karte);
  }
}
