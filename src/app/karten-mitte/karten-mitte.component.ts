import { Component, OnInit, Input } from '@angular/core';
import { CardType } from '../modelle/Session';

@Component({
  selector: 'app-karten-mitte',
  templateUrl: './karten-mitte.component.html',
  styleUrls: ['./karten-mitte.component.css'],
})
export class KartenMitteComponent implements OnInit {
  @Input() karten: CardType[];
  constructor() {}

  ngOnInit(): void {}
}
