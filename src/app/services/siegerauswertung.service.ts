import { Injectable } from '@angular/core';
import { KartenTyp } from '../modelle/KartenTyp';

@Injectable({
  providedIn: 'root',
})
export class SiegerauswertungService {
  constructor() {}

  getSieger(cards: KartenTyp[], rechter: KartenTyp): KartenTyp {
    cards = cards.map((c) => {
      //Linker oder Rechter
      if (c.level === rechter.level) c.level += 100;
      //Farbe der ersten ausgespielten Karte
      if (c.color === cards[0].color) c.level += 10;
      //Trumph
      if (c.color === rechter.color) c.level += 20;
      return c;
    });
    return cards.sort((a, b) => b.level - a.level)[0];
  }
}
