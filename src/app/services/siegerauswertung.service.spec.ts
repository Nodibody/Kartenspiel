import { TestBed } from '@angular/core/testing';

import { SiegerauswertungService } from './siegerauswertung.service';

describe('SiegerauswertungService', () => {
  let service: SiegerauswertungService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiegerauswertungService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
