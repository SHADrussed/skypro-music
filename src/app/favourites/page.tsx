"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MusicLayout from "@/components/MusicLayout";
import CenterBlock from "@/components/CenterBlock/CenterBlock";
import { getFavorites } from "@/lib/api";
import { readSession } from "@/lib/session";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { begin, failed, loaded } from "@/store/favoritesSlice";

export default function Favourites() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { ready, session } = useAppSelector(state => state.auth);
  const favorites = useAppSelector(state => state.favorites);
  useEffect(() => { if (ready && !session) router.replace("/"); }, [ready, session, router]);
  if (!ready || !session) return <MusicLayout><p role="status">Загрузка избранного…</p></MusicLayout>;
  async function retry() {
    const current = readSession();
    if (!current) return;
    dispatch(begin(current.user._id));
    try {
      const tracks = await getFavorites();
      if (readSession()?.refresh === current.refresh) dispatch(loaded({ owner: current.user._id, tracks }));
    } catch (error) {
      if (readSession()?.refresh === current.refresh) dispatch(failed(error instanceof Error ? error.message : "Не удалось загрузить избранное."));
    }
  }
  return <MusicLayout>
    {favorites.loading ? <p role="status">Загрузка избранного…</p> :
      favorites.error ? <div role="alert"><p>{favorites.error}</p><button onClick={retry}>Повторить</button></div> :
      <CenterBlock title="Мои треки" tracks={favorites.tracks} />}
  </MusicLayout>;
}
