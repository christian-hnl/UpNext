import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { SessionHost } from "./session-host";
import { SupabaseService } from "../../../services/supabase-service";
import { Spotify } from "../../../services/spotify";
import { createSupabaseMock, createSpotifyMock } from "../../../testing/test-helpers";

describe("SessionHost", () => {
  let component: SessionHost;
  let fixture: ComponentFixture<SessionHost>;
  let supabase: ReturnType<typeof createSupabaseMock>;

  beforeEach(async () => {
    localStorage.setItem("userId", "user-1");
    supabase = createSupabaseMock();

    await TestBed.configureTestingModule({
      imports: [SessionHost],
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useValue: supabase },
        { provide: Spotify, useValue: createSpotifyMock() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionHost);
    fixture.componentRef.setInput("sessionId", 123456);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("verifies the host on init", () => {
    expect(supabase.checkHost).toHaveBeenCalledWith("user-1", 123456);
  });

  it("blocks a participant and reloads the member list", async () => {
    await component.blockParticipant("p-9");
    expect(supabase.setParticipantStatus).toHaveBeenCalledWith("p-9", "blocked");
    expect(supabase.getAllParticipantsBySessionId).toHaveBeenCalled();
  });
});
