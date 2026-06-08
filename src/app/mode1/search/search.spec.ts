import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Search } from "./search";
import { SupabaseService } from "../../../services/supabase-service";
import { Spotify } from "../../../services/spotify";
import { createSupabaseMock, createSpotifyMock } from "../../../testing/test-helpers";

describe("Search", () => {
  let component: Search;
  let fixture: ComponentFixture<Search>;
  let supabase: ReturnType<typeof createSupabaseMock>;

  beforeEach(async () => {
    supabase = createSupabaseMock();

    await TestBed.configureTestingModule({
      imports: [Search],
      providers: [
        { provide: SupabaseService, useValue: supabase },
        { provide: Spotify, useValue: createSpotifyMock() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Search);
    fixture.componentRef.setInput("sessionId", 123456);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("subscribes to the queue on init", () => {
    expect(supabase.subscribeToQueue).toHaveBeenCalled();
  });

  it("clears results when the search term is empty", async () => {
    await component.performSearch("");
    expect(component.searchTracks).toEqual([]);
  });
});
