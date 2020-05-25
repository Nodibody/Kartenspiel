import { Component } from '@angular/core';
import { SiegerauswertungService } from './services/siegerauswertung.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title: string = 'Kartenspiel';
  winner: string = '';
  constructor(private siegerauswertung: SiegerauswertungService) {}

  getWinner() {
    const cards = [
      { color: 'Schelle', levelString: 'Unter', level: 5 },
      { color: 'Eichel', levelString: 'Ober', level: 6 },
      { color: 'Schelle', levelString: 'Zehner', level: 4 },
      { color: 'Schelle', levelString: 'König', level: 7 },
    ];
    const rechter = { color: 'Schelle', levelString: 'König', level: 7 };

    this.winner = JSON.stringify(
      this.siegerauswertung.getSieger(cards, rechter)
    );
    //{"color":"Schelle","levelString":"König","level":137}
  }
}
