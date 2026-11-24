import type { Track } from "@/types/types";
import { searchTracks } from "./searchTracks";

export type ReleaseOrder = "ascending" | "descending";

export function filterTracks(
  tracks: readonly Track[],
  query: string,
  author: string,
  genre: string,
  order?: ReleaseOrder,
): Track[] {
  const matches = searchTracks(tracks, query).filter(
    (track) => (!author || track.author === author) && (!genre || track.genre.includes(genre)),
  );

  if (!order) return matches;
  const direction = order === "ascending" ? 1 : -1;
  // The catalog supplies release dates as YYYY-MM-DD.
  return matches.sort((a, b) => {
    if (!a.release_date || !b.release_date) {
      return Number(!a.release_date) - Number(!b.release_date);
    }
    return direction * a.release_date.localeCompare(b.release_date);
  });
}
