import FavoritesFilter from "@/components/FavoritesFilter";
import type { Track } from "@/types/types";

const tracks: Track[] = [
  { id: 1, title: "One More Time", artist: "Daft Punk", isFavorite: true },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd", isFavorite: false },
  { id: 3, title: "Intro", artist: "The xx", isFavorite: true },
  { id: 4, title: "Midnight City", artist: "M83", isFavorite: false },
];

export default function Favourites() {
  return (
    <>
      <h1>Favourites</h1>
      <FavoritesFilter tracks={tracks} />
    </>
  );
}
