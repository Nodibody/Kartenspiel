import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KartenMitteComponent } from './karten-mitte.component';

describe('KartenMitteComponent', () => {
  let component: KartenMitteComponent;
  let fixture: ComponentFixture<KartenMitteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KartenMitteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KartenMitteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
