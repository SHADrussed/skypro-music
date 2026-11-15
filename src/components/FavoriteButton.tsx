"use client";
import { useState, useSyncExternalStore } from "react";
import type { Track } from "@/types/types";
import { setFavorite } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { add, remove } from "@/store/favoritesSlice";

export default function FavoriteButton({ track, className }: { track: Track; className?: string }) {
  const dispatch = useAppDispatch();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const session = useAppSelector(state => state.auth.session);
  const liked = useAppSelector(state => state.favorites.tracks.some(item => item._id === track._id));
  const loading = useAppSelector(state => state.favorites.loading);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function toggle() {
    if (!session || pending || loading) return;
    const next = !liked;
    setPending(true); setError("");
    dispatch(next ? add(track) : remove(track._id));
    try { await setFavorite(track._id, next); }
    catch (cause) {
      dispatch(next ? remove(track._id) : add(track));
      setError(cause instanceof Error ? cause.message : "Не удалось изменить избранное.");
    } finally { setPending(false); }
  }
  return <span className={className}>
    <button type="button" aria-label={mounted && liked ? `Убрать ${track.name} из избранного` : `Добавить ${track.name} в избранное`}
      aria-pressed={mounted && liked} disabled={!mounted || !session || pending || loading} onClick={toggle}
      style={{ border: 0, background: "transparent", color: mounted && liked ? "#ad61ff" : "inherit", cursor: mounted && session ? "pointer" : "not-allowed" }}>
      <svg width="18" height="18" fill={mounted && liked ? "currentColor" : "none"} stroke="currentColor" aria-hidden="true"><use xlinkHref="/img/icon/sprite.svg#icon-like" /></svg>
    </button>
    {error && <span role="alert" style={{ color: "#ff8a8a" }}>{error}</span>}
  </span>;
}
