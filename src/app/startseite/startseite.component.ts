import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-startseite',
  templateUrl: './startseite.component.html',
  styleUrls: ['./startseite.component.scss'],
})
export class StartseiteComponent implements OnInit {
  sessionIdFC: FormControl = new FormControl('', []);

  constructor(private router: Router) {}

  ngOnInit(): void {}

  createSession() {
    this.sessionIdFC.markAsUntouched();
  }

  joinSession() {
    this.sessionIdFC.setErrors({ required: true });
    this.sessionIdFC.markAsTouched();
  }
}
