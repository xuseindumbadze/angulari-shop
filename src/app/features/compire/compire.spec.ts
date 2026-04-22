import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Compire } from './compire';

describe('Compire', () => {
  let component: Compire;
  let fixture: ComponentFixture<Compire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compire],
    }).compileComponents();

    fixture = TestBed.createComponent(Compire);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
