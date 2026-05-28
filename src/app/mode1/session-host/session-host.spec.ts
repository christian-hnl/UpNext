import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SessionHost } from "./session-host";

describe("SessionHost", () => {
  let component: SessionHost;
  let fixture: ComponentFixture<SessionHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionHost],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionHost);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
