"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clear } from "@/store/favoritesSlice";
import { resetPlayer } from "@/store/playerSlice";
import { writeSession } from "@/lib/session";

export default function AccountControls() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const { ready, session } = useAppSelector(state => state.auth);
  if (!mounted || !ready) return null;
  if (!session) return <Link href="/signin">Войти</Link>;
  return <><span>{session.user.username}</span><button type="button" aria-label="Выйти" onClick={() => {
    writeSession(null);
    dispatch(clear());
    dispatch(resetPlayer());
    if (pathname === "/favourites") router.replace("/");
  }}>Выйти</button></>;
}
