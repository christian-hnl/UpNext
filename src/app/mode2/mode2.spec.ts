import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mode2 } from './mode2';

describe('Mode2', () => {
  let component: Mode2;
  let fixture: ComponentFixture<Mode2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mode2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mode2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
