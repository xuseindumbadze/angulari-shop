import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Headercomponent } from './headercomponent';

describe('Headercomponent', () => {
  let component: Headercomponent;
  let fixture: ComponentFixture<Headercomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Headercomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Headercomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
