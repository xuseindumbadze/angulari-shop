import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupModals } from './signup-modals';

describe('SignupModals', () => {
  let component: SignupModals;
  let fixture: ComponentFixture<SignupModals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupModals],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupModals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
