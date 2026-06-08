import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SessionMemberMode2 } from "./session-member-mode2";

describe("SessionMemberMode2", () => {
  let component: SessionMemberMode2;
  let fixture: ComponentFixture<SessionMemberMode2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionMemberMode2],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionMemberMode2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
