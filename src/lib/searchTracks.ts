import type { Track } from "@/types/types";

export function searchTracks(tracks: readonly Track[], query: string): Track[] {
  const prefix = query.trim().toLowerCase();
  return tracks.filter((track) => track.name.toLowerCase().startsWith(prefix));
}
