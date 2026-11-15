"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setPlaylist } from "@/store/playerSlice";
import cn from "classnames";
import type { Track } from "@/types/types";
import ContentBlock from "@/components/ContentBlock/ContentBlock";
import styles from "./FilterBlock.module.css";

type FilterName = "author" | "year" | "genre";

export default function FilterBlock({ tracks }: { tracks: Track[] }) {
  const dispatch = useAppDispatch();
  useEffect(() => { dispatch(setPlaylist(tracks)); }, [dispatch, tracks]);
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const filters: { id: FilterName; label: string; options: string[] }[] = [
    { id: "author", label: "исполнителю", options: [...new Set(tracks.map(track => track.author))] },
    { id: "year", label: "году выпуска", options: ["По возрастанию", "По убыванию"] },
    { id: "genre", label: "жанру", options: [...new Set(tracks.flatMap(track => track.genre))] },
  ];
  const filtered = tracks.filter(track => (!author || track.author === author) && (!genre || track.genre.includes(genre)));
  if (year) filtered.sort((a, b) => year === "По возрастанию" ? a.release_date.localeCompare(b.release_date) : b.release_date.localeCompare(a.release_date));

  return (
    <><div
      className={styles.centerblock__filter}
      onKeyDown={(event) => {
        if (event.key === "Escape" && activeFilter) {
          document.getElementById(`filter-${activeFilter}`)?.focus();
          setActiveFilter(null);
        }
      }}
    >
      <div className={styles.filter__title}>Искать по:</div>
      {filters.map(({ id, label, options }) => (
        <div className={styles.filter__category} key={id}>
          <button
            type="button"
            id={`filter-${id}`}
            aria-expanded={activeFilter === id}
            aria-controls={`filter-options-${id}`}
            className={cn(styles.filter__button, { [styles.filter__buttonActive]: activeFilter === id })}
            onClick={() => setActiveFilter((current) => current === id ? null : id)}
          >
            {label}
          </button>
          {activeFilter === id && (
            <section
              id={`filter-options-${id}`}
              aria-label={`Варианты: ${label}`}
              className={styles.filter__popup}
            >
              <ul className={styles.filter__list}>
                {options.map((option) => (
                  <li key={option}>
                    <button type="button" className={styles.filter__option} onClick={() => {
                      if (id === "author") setAuthor(current => current === option ? "" : option);
                      if (id === "genre") setGenre(current => current === option ? "" : option);
                      if (id === "year") setYear(current => current === option ? "" : option);
                      setActiveFilter(null);
                    }}>
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      ))}
    </div>{filtered.length ? <ContentBlock tracks={filtered} /> : <p>Треков пока нет.</p>}</>
  );
}
