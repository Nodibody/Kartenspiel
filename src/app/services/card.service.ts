import { Injectable } from '@angular/core';
import allCards from '../../assets/cards.json';
import { CardType } from '../modelle/Session';

const levelStrings = new Map<number, string>([
  [0, 'Sechser'],
  [1, 'Siebener'],
  [2, 'Achter'],
  [3, 'Neuner'],
  [4, 'Zehner'],
  [5, 'Unter'],
  [6, 'Ober'],
  [7, 'König'],
  [8, 'Sau'],
]);

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private cards: CardType[] = allCards.map((v) => v);
  constructor() {}

  public drawCards(): CardType[] {
    const cards: CardType[] = [];
    let index: number;
    for (let i = 0; i < 5; i++) {
      index = Math.floor(Math.random() * this.cards.length);
      cards.push(this.cards[index]);
      this.cards.splice(index, 1);
    }
    return cards;
  }

  public drawAllCards(): CardType[][] {
    return [
      this.drawCards(),
      this.drawCards(),
      this.drawCards(),
      this.drawCards(),
    ];
  }
  public newDeck(): CardType[] {
    return (this.cards = allCards.map((v) => v));
  }

  public shuffle(): CardType[] {
    let newPos: number;
    let temp: CardType;
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
  public getCard(color: string, level: number): CardType {
    return { level, color, levelString: levelStrings.get(level) };
  }
}
