import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Queuevoting } from "./queuevoting";

describe("Queuevoting", () => {
  let component: Queuevoting;
  let fixture: ComponentFixture<Queuevoting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Queuevoting],
    }).compileComponents();

    fixture = TestBed.createComponent(Queuevoting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
