import FavoritesFilter from "@/components/FavoritesFilter";
import { tracks } from "@/data/data";

export default function Favourites() {
  return (
    <>
      <h1>Favourites</h1>
      <FavoritesFilter tracks={tracks} />
    </>
  );
}
