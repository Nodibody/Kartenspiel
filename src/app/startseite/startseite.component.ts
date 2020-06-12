import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-startseite',
  templateUrl: './startseite.component.html',
  styleUrls: ['./startseite.component.scss'],
})
export class StartseiteComponent implements OnInit {
  @Output() sessionCreator: EventEmitter<void> = new EventEmitter<void>();
  @Output() sessionJoiner: EventEmitter<string> = new EventEmitter<string>();
  sessionIdFC: FormControl = new FormControl('', []);

  constructor() {}

  ngOnInit(): void {}

  createSession() {
    this.sessionIdFC.markAsUntouched();
    this.sessionCreator.emit();
  }

  joinSession() {
    if ((this.sessionIdFC.value + '').trim().length === 0) {
      this.sessionIdFC.setValue('');
      this.sessionIdFC.setErrors({ required: true });
    }
    this.sessionIdFC.markAsTouched();
    if (this.sessionIdFC.hasError('required')) return;
    this.sessionJoiner.emit(this.sessionIdFC.value + '');
  }
}
