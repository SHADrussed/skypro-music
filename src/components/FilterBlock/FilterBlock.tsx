"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setPlaylist } from "@/store/playerSlice";
import cn from "classnames";
import { filterTracks } from "@/lib/filterTracks";
import type { ReleaseOrder } from "@/lib/filterTracks";
import type { Track } from "@/types/types";
import ContentBlock from "@/components/ContentBlock/ContentBlock";
import styles from "./FilterBlock.module.css";

type FilterName = "author" | "year" | "genre";
const releaseOrders = new Map<string, ReleaseOrder>([
  ["По возрастанию", "ascending"],
  ["По убыванию", "descending"],
]);

export default function FilterBlock({
  search,
  tracks,
}: {
  search: string;
  tracks: Track[];
}) {
  const dispatch = useAppDispatch();
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const selected = { author, genre, year };
  const hasFilters = Boolean(author || genre || year);
  const filters: { id: FilterName; label: string; options: string[] }[] = [
    {
      id: "author",
      label: "исполнителю",
      options: [...new Set(tracks.map((track) => track.author))],
    },
    {
      id: "year",
      label: "году выпуска",
      options: [...releaseOrders.keys()],
    },
    {
      id: "genre",
      label: "жанру",
      options: [...new Set(tracks.flatMap((track) => track.genre))],
    },
  ];
  const filtered = useMemo(
    () => filterTracks(tracks, search, author, genre, releaseOrders.get(year)),
    [tracks, search, author, genre, year],
  );
  useEffect(() => {
    dispatch(setPlaylist(filtered));
  }, [dispatch, filtered]);

  return (
    <>
      <div
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
              className={cn(styles.filter__button, {
                [styles.filter__buttonActive]: activeFilter === id || Boolean(selected[id]),
              })}
              onClick={() =>
                setActiveFilter((current) => (current === id ? null : id))
              }
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
                      <button
                        type="button"
                        aria-pressed={selected[id] === option}
                        className={cn(styles.filter__option, {
                          [styles.filter__optionSelected]: selected[id] === option,
                        })}
                        onClick={() => {
                          if (id === "author")
                            setAuthor((current) =>
                              current === option ? "" : option,
                            );
                          if (id === "genre")
                            setGenre((current) =>
                              current === option ? "" : option,
                            );
                          if (id === "year")
                            setYear((current) =>
                              current === option ? "" : option,
                            );
                          setActiveFilter(null);
                        }}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        ))}
        <button
          type="button"
          className={styles.filter__button}
          disabled={!hasFilters}
          onClick={() => {
            setAuthor("");
            setGenre("");
            setYear("");
            setActiveFilter(null);
          }}
        >
          Сбросить фильтры
        </button>
      </div>
      {filtered.length ? (
        <ContentBlock tracks={filtered} />
      ) : (
        <p>Нет подходящих треков</p>
      )}
    </>
  );
}
