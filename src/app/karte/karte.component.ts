import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KartenTyp } from '../modelle/KartenTyp';

@Component({
  selector: 'app-karte',
  templateUrl: './karte.component.html',
  styleUrls: ['./karte.component.css'],
})
export class KarteComponent implements OnInit {
  @Input() Karte: KartenTyp;
  @Output() benutzeKarte: EventEmitter<KartenTyp> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onClick() {
    this.benutzeKarte.emit(this.Karte);
  }

  getImgPath(): string {
    return `assets/${this.Karte.color}/${this.Karte.levelString}.png`;
  }
}
