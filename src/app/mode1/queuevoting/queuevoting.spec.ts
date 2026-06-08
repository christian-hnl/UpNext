import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Queuevoting } from "./queuevoting";
import { SupabaseService } from "../../../services/supabase-service";
import { Spotify } from "../../../services/spotify";
import { createSupabaseMock, createSpotifyMock } from "../../../testing/test-helpers";

describe("Queuevoting", () => {
  let component: Queuevoting;
  let fixture: ComponentFixture<Queuevoting>;
  let supabase: ReturnType<typeof createSupabaseMock>;
  let spotify: ReturnType<typeof createSpotifyMock>;

  beforeEach(async () => {
    supabase = createSupabaseMock();
    spotify = createSpotifyMock();

    await TestBed.configureTestingModule({
      imports: [Queuevoting],
      providers: [
        { provide: SupabaseService, useValue: supabase },
        { provide: Spotify, useValue: spotify },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Queuevoting);
    fixture.componentRef.setInput("sessionId", 123456);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("loads the queue for its session on init", () => {
    expect(supabase.getQueue).toHaveBeenCalledWith(123456);
  });

  it("sends an upvote", async () => {
    localStorage.setItem("userId", "user-1");
    await component.upvote(7);
    expect(supabase.vote).toHaveBeenCalledWith(7, "user-1", 1);
  });

  it("auto-removes the currently playing song from the queue (host only)", async () => {
    fixture.componentRef.setInput("isHost", true);
    supabase.getQueue.mockResolvedValue({
      data: [{ id: 5, spotify_id: "spotify:track:abc" }],
      error: null,
    } as any);
    spotify.getCurrentlyPlaying.mockResolvedValue({ item: { uri: "spotify:track:abc" } } as any);

    await component.loadQueue();
    await component.loadCurrentlyPlaying();

    expect(supabase.removeSongFromQueue).toHaveBeenCalledWith(5);
  });

  it("does not remove songs for non-hosts", async () => {
    // isHost defaults to false
    supabase.getQueue.mockResolvedValue({
      data: [{ id: 5, spotify_id: "spotify:track:abc" }],
      error: null,
    } as any);
    spotify.getCurrentlyPlaying.mockResolvedValue({ item: { uri: "spotify:track:abc" } } as any);

    await component.loadQueue();
    await component.loadCurrentlyPlaying();

    expect(supabase.removeSongFromQueue).not.toHaveBeenCalled();
  });
});
