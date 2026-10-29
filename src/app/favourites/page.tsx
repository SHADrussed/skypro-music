import FavoritesFilter from "@/components/FavoritesFilter";
import { data } from "@/data/data";

export default function Favourites() {
  return (
    <>
      <h1>Favourites</h1>
      <FavoritesFilter tracks={data} />
    </>
  );
}
