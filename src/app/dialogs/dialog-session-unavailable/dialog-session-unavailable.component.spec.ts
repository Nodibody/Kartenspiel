import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSessionUnavailableComponent } from './dialog-session-unavailable.component';

describe('DialogSessionUnavailableComponent', () => {
  let component: DialogSessionUnavailableComponent;
  let fixture: ComponentFixture<DialogSessionUnavailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSessionUnavailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSessionUnavailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
