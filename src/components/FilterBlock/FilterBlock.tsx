"use client";

import { useState } from "react";
import cn from "classnames";
import { data } from "@/data/data";
import styles from "./FilterBlock.module.css";

type FilterName = "author" | "year" | "genre";

const filters: { id: FilterName; label: string; options: string[] }[] = [
  { id: "author", label: "исполнителю", options: [...new Set(data.map((track) => track.author))] },
  { id: "year", label: "году выпуска", options: ["По возрастанию", "По убыванию"] },
  { id: "genre", label: "жанру", options: [...new Set(data.flatMap((track) => track.genre))] },
];

export default function FilterBlock() {
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);

  return (
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
                    <button type="button" className={styles.filter__option}>
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      ))}
    </div>
  );
}
