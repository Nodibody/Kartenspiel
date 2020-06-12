import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHostGoneComponent } from './dialog-host-gone.component';

describe('DialogHostGoneComponent', () => {
  let component: DialogHostGoneComponent;
  let fixture: ComponentFixture<DialogHostGoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogHostGoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHostGoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
