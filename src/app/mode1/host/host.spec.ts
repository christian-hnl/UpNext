import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Host } from './host';
import { SupabaseService } from '../../../services/supabase-service';
import { Spotify } from '../../../services/spotify';
import { createSupabaseMock, createSpotifyMock } from '../../../testing/test-helpers';

describe('Host', () => {
  let component: Host;
  let fixture: ComponentFixture<Host>;
  let spotify: ReturnType<typeof createSpotifyMock>;

  beforeEach(async () => {
    spotify = createSpotifyMock();

    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useValue: createSupabaseMock() },
        { provide: Spotify, useValue: spotify },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Host);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('finishes loading after the auth check (no login flash)', () => {
    expect(component.loading()).toBe(false);
  });

  it('logs in via Spotify', async () => {
    await component.onLogin();
    expect(spotify.login).toHaveBeenCalled();
  });
});
