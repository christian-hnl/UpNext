export interface SpotifyResponse {
}

export interface UserProfile {
  display_name: string;
  email: string;
  images: SpotifyImage[];
}

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}


export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  is_playable: boolean;
  uri: string;
  type: string;

  album?: any;
  artists: any[];
}
