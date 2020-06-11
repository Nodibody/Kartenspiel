import { Injectable } from '@angular/core';
import allCards from '../../assets/cards.json';
import { KartenTyp } from '../modelle/KartenTyp';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private cards: KartenTyp[] = allCards.map((v) => v);
  constructor() {}

  public drawCards(): KartenTyp[] {
    const cards: KartenTyp[] = [];
    let index: number;
    for (let i = 0; i < 5; i++) {
      index = Math.floor(Math.random() * this.cards.length);
      cards.push(this.cards[index]);
      this.cards.splice(index, 1);
    }
    return cards;
  }

  public drawAllCards(): KartenTyp[][] {
    return [
      this.drawCards(),
      this.drawCards(),
      this.drawCards(),
      this.drawCards(),
    ];
  }
  public newDeck(): KartenTyp[] {
    return (this.cards = allCards.map((v) => v));
  }

  public shuffle(): KartenTyp[] {
    let newPos: number;
    let temp: KartenTyp;
    for (let t = 0; t < 10; t++) {
      for (let i = this.cards.length - 1; i > 0; i--) {
        newPos = Math.floor(Math.random() * (i + 1));
        temp = this.cards[i];
        this.cards[i] = this.cards[newPos];
        this.cards[newPos] = temp;
      }
    }
    return this.cards;
  }
}
