import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { SessionMember } from "./session-member";
import { SupabaseService } from "../../../services/supabase-service";
import { Spotify } from "../../../services/spotify";
import { createSupabaseMock, createSpotifyMock } from "../../../testing/test-helpers";

describe("SessionMember", () => {
  let component: SessionMember;
  let fixture: ComponentFixture<SessionMember>;
  let supabase: ReturnType<typeof createSupabaseMock>;

  beforeEach(async () => {
    supabase = createSupabaseMock();

    await TestBed.configureTestingModule({
      imports: [SessionMember],
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useValue: supabase },
        { provide: Spotify, useValue: createSpotifyMock() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionMember);
    fixture.componentRef.setInput("sessionId", 123456);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("loads the session title on init", () => {
    expect(supabase.getPrivateSessionInfos).toHaveBeenCalledWith(123456);
    expect(component.title()).toBe("Test");
  });

  it("finishes loading after init (no lobby flash)", () => {
    expect(component.loading()).toBe(false);
  });
});
