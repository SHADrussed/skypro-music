"use client";
import FilterBlock from "@/components/FilterBlock/FilterBlock";
import SearchBar from "@/components/SearchBar/SearchBar";
import styles from "./CenterBlock.module.css";
import type { Track } from "@/types/types";

import { useLayoutEffect, useState } from "react";

export default function CenterBlock({
  tracks,
  title = "Треки",
}: {
  tracks: Track[];
  title?: string;
}) {
  const [search, setSearch] = useState("");

  // Next.js can hide and preserve the page when navigating away.
  useLayoutEffect(() => () => setSearch(""), []);

  return (
    <div className={styles.centerblock}>
      <SearchBar search={search} setSearch={setSearch} />
      <h2 className={styles.centerblock__h2}>{title}</h2>
      <FilterBlock search={search} tracks={tracks} />
    </div>
  );
}
