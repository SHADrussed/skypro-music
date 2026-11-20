"use client";
import { useEffect } from "react";
import { getFavorites } from "@/lib/api";
import { readSession } from "@/lib/session";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setSession } from "./authSlice";
import { begin, clear, failed, loaded } from "./favoritesSlice";

export default function SessionBridge() {
  const dispatch = useAppDispatch();
  const session = useAppSelector(state => state.auth.session);
  const refresh = session?.refresh;
  const owner = session?.user._id;
  useEffect(() => {
    const sync = () => dispatch(setSession(readSession()));
    sync();
    window.addEventListener("skypro-session-change", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("skypro-session-change", sync); window.removeEventListener("storage", sync); };
  }, [dispatch]);
  useEffect(() => {
    if (!refresh || owner === undefined) { dispatch(clear()); return; }
    dispatch(begin(owner));
    void getFavorites().then(tracks => {
      if (readSession()?.refresh === refresh) dispatch(loaded({ owner, tracks }));
    }).catch(error => {
      if (readSession()?.refresh === refresh) dispatch(failed(error instanceof Error ? error.message : "Не удалось загрузить избранное."));
    });
  }, [dispatch, refresh, owner]);
  return null;
}
