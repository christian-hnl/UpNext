import { vi } from 'vitest';

/**
 * Reusable, dependency-free test doubles for the two services that talk to the
 * outside world (Supabase + Spotify). Every method is a vi.fn() returning a
 * sensible, resolved value so components can run ngOnInit in tests without
 * hitting the network. Override individual methods per test as needed.
 */

export function createSupabaseMock() {
  // a chainable fake realtime channel
  const channel: any = {
    on: vi.fn(() => channel),
    subscribe: vi.fn(() => channel),
  };

  return {
    // raw client surface used directly by some components (realtime)
    supabase: {
      channel: vi.fn(() => channel),
      removeChannel: vi.fn(),
    },

    // sessions
    addPrivateSession: vi.fn(async () => [
      { session_id: 123456, qrCodeData: 'http://x/123456', title: 'Test' },
    ]),
    joinPrivateSession: vi.fn(async () => ({ data: { session_id: 123456 }, error: null })),
    joinPublicSession: vi.fn(async () => ({ data: { session_id: 223456 }, error: null })),
    getPrivateSessionInfos: vi.fn(async () => ({
      data: { title: 'Test', qrCodeData: 'http://x/123456', spotify_token: null },
      error: null,
    })),
    endSession: vi.fn(async () => ({ data: null, error: null })),

    // participants
    addUser: vi.fn(async () => ({ data: { id: 'user-1' }, error: null })),
    getUserInfos: vi.fn(async () => ({
      data: { id: 'user-1', name: 'Tester', status: 'active', role: 'host' },
      error: null,
    })),
    getMemberNamesBySessionId: vi.fn(async () => ({ data: [], error: null })),
    getHostNameBySessionId: vi.fn(async () => ({ data: { name: 'Host' }, error: null })),
    checkHost: vi.fn(async () => ({ data: { id: 'user-1' }, error: null })),
    getAllParticipantsBySessionId: vi.fn(async () => ({ data: [], error: null })),
    setParticipantStatus: vi.fn(async () => ({ data: null, error: null })),

    // queue + votes
    addSongToQueue: vi.fn(async () => ({ id: 1, score: 1 })),
    getQueue: vi.fn(async () => ({ data: [], error: null })),
    vote: vi.fn(async () => ({ score: 1 })),
    getSongVotes: vi.fn(async () => 0),
    removeSongFromQueue: vi.fn(async () => ({ data: null, error: null })),
    subscribeToQueue: vi.fn(() => channel),
  };
}

export function createSpotifyMock() {
  return {
    login: vi.fn(async () => null),
    setAccessToken: vi.fn(),
    search: vi.fn(async () => ({ tracks: { items: [] } })),
    getMyProfile: vi.fn(async () => ({ display_name: 'Tester', email: 'test@example.com' })),
    logout: vi.fn(async () => {}),
    getAccessToken: vi.fn(async () => null),
    getAvailableDevices: vi.fn(async () => []),
    transferPlayback: vi.fn(async () => {}),
    getCurrentlyPlaying: vi.fn(async () => null),
    getPlaybackState: vi.fn(async () => null),
    getQueue: vi.fn(async () => null),
    addToQueue: vi.fn(async () => true),
  };
}
