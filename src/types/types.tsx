export type Track = {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration_in_seconds: number;
  album: string;
  logo: string | null;
  track_file: string;
  stared_user: unknown[];
};

export type Artist = {
  id: number;
  name: string;
  isFavorite: boolean;
};
