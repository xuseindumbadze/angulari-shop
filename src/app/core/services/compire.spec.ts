import { TestBed } from '@angular/core/testing';

import { Compire } from './compire';

describe('Compire', () => {
  let service: Compire;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Compire);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
