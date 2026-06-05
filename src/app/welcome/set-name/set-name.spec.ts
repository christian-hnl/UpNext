import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SetName } from "./set-name";

describe("SetName", () => {
  let component: SetName;
  let fixture: ComponentFixture<SetName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetName],
    }).compileComponents();

    fixture = TestBed.createComponent(SetName);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
