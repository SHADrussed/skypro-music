"use client";
import MusicLayout from "@/components/MusicLayout";
export default function ErrorPage({ reset }: { reset: () => void }) { return <MusicLayout><div role="alert"><p>Не удалось загрузить данные.</p><button onClick={reset}>Повторить</button></div></MusicLayout>; }
