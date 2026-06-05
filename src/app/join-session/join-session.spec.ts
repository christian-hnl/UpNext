import { ComponentFixture, TestBed } from "@angular/core/testing";

import { JoinSession } from "./join-session";

describe("JoinSession", () => {
  let component: JoinSession;
  let fixture: ComponentFixture<JoinSession>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinSession],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinSession);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
