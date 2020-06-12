import { Component, OnInit, Input } from '@angular/core';
import { KartenTyp } from '../modelle/KartenTyp';
import { AppComponent } from '../app.component';
import { switchMap, filter, map, delay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogHostGoneComponent } from '../dialogs/dialog-host-gone/dialog-host-gone.component';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @Input() sessionId: string;
  @Input() host: boolean;
  @Input() app: AppComponent;
  karten: KartenTyp[];
  playerCount: number;
  private sessionService: SessionService;
  isNextPlayer: Observable<boolean>;

  constructor(private matDialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.sessionService = this.app.sessionService;
    console.log(`Host: ${this.host}`);

    // Cards
    this.app.uuid
      .pipe(switchMap((token) => this.sessionService.getCards(token)))
      .subscribe((cards) => (this.karten = cards));

    // User info player count / scrap game
    const sub = this.sessionService.playerCount
      .pipe(
        map((count) => (this.playerCount = count)),
        filter((count) => count >= 4),
        delay(500),
        filter((count) => !this.karten),
        switchMap((count) =>
          this.matDialog.open(DialogHostGoneComponent).afterClosed()
        )
      )
      .subscribe(async () => {
        sub.unsubscribe();
        await this.router.navigateByUrl('/?');
        location.reload();
      });

    // isNextPlayer
    this.isNextPlayer = this.app.uuid.pipe(
      switchMap((token) => this.sessionService.isNextPlayer(token))
    );
  }
  useCard(card: KartenTyp) {
    // TODO: Add Card to middle of table
    this.app.uuid
      .pipe()
      .subscribe((token) => this.sessionService.sendPlayedCard(card, token));
  }
}
