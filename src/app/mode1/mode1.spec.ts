import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mode1 } from './mode1';

describe('Mode1', () => {
  let component: Mode1;
  let fixture: ComponentFixture<Mode1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mode1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mode1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
