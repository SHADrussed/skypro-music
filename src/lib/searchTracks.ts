import type { Track } from "@/types/types";

export function searchTracks(tracks: readonly Track[], query: string): Track[] {
  const filteredTracks = tracks.filter(track => track.name.toLowerCase().startsWith(query.trim().toLowerCase()));
  return filteredTracks;
}
