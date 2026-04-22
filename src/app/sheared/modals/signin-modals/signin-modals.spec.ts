
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SigninModalsComponent } from '../../modals/signin-modals/signin-modals';

describe('SigninModals', () => {
  let component: SigninModalsComponent;
  let fixture: ComponentFixture<SigninModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SigninModalsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SigninModalsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
