import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KartenTyp } from '../modelle/KartenTyp';

@Component({
  selector: 'app-karte',
  templateUrl: './karte.component.html',
  styleUrls: ['./karte.component.scss'],
})
export class KarteComponent implements OnInit {
  @Input() karte: KartenTyp;
  @Output() benutzeKarte: EventEmitter<KartenTyp> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    // console.log(this.karte);
  }

  onClick() {
    this.benutzeKarte.emit(this.karte);
  }

  getImgPath(): string {
    return `assets/${this.karte.color}/${this.karte.levelString}.PNG`;
  }
}
