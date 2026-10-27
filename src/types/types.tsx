export type Track = {
  id: number;
  title: string;
  artist: string;
  isFavorite: boolean;
  imageUrl: string;
};

export type Artist = {
  id: number;
  name: string;
  isFavorite: boolean;
};
