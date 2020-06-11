import { Injectable } from '@angular/core';
import { PlayedCardType, KartenTyp } from '../modelle/KartenTyp';

@Injectable({
  providedIn: 'root',
})
export class SiegerauswertungService {
  constructor() {}

  public getWinner(cards: PlayedCardType[], rechter: KartenTyp): string {
    cards = cards.map((card) => {
      //Linker oder Rechter
      if (card.level === rechter.level) card.level += 100;
      //Trumph
      if (card.color === rechter.color) card.level += 20;
      //Farbe der ersten Ausgespielten
      if (card.color === cards[0].color) card.level += 10;
      return card;
    });
    cards.sort((a, b) => b.level - a.level);
    console.log(cards);
    return cards[0].player;
  }
}
