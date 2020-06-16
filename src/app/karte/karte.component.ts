import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CardType } from '../modelle/Session';

@Component({
  selector: 'app-karte',
  templateUrl: './karte.component.html',
  styleUrls: ['./karte.component.scss'],
})
export class KarteComponent implements OnInit {
  @Input() karte: CardType;
  @Output() benutzeKarte: EventEmitter<CardType> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    // console.log(this.karte);
  }

  onClick() {
    this.benutzeKarte.emit(this.karte);
  }

  getImgPath(): string {
    return `assets/${this.karte?.color}/${this.karte?.levelString}.PNG`;
  }
}
