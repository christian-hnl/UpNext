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

export interface SpotifySearch{
  title: string
}
