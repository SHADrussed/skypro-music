"use client";
import type { Track } from "@/types/types";
import { useState } from "react";

export default function FavoritesFilter({ tracks }: { tracks: Track[] }) {
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  return (
    <div>
      <h1>Favorites Filter</h1>
      <button onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}>
        {showOnlyFavorites ? "Показать все" : "Только избранные"}
      </button>
      <ul>
        {tracks
          .filter((track) => !showOnlyFavorites || track.isFavorite)
          .map((track) => (
            <li key={track.id}>
              {track.title} — {track.artist}
            </li>
          ))}
      </ul>
    </div>
  );
}
