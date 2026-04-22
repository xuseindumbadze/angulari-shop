import { TestBed } from '@angular/core/testing';

import { ProductFilter } from './product-filter';

describe('ProductFilter', () => {
  let service: ProductFilter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductFilter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
