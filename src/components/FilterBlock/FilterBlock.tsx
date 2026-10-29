"use client";
import { useState } from "react";
import styles from "./FilterBlock.module.css";
import classNames from "classnames";

type FilterName = "artist" | "year" | "genre";
// export const filters: FilterItem[] = [
//   { name: "исполнителю", items: ["Tame Impala", "Arctic Monkeys"] },
//   { name: "году выпуска", items: ["2024", "2025", "2026"] },
//   { name: "жанру", items: ["Rock", "Indie", "Pop"] },
// ];

export default function FilterBlock() {
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);
  const nameFilter = "artist";
  const yearFilter = "year";
  const genreFilter = "genre";
  const items = ["Rock", "Indie", "Pop", "Rock1", "Indie2", "Pop3"];

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>
      <div className={styles.filter__item}>
        <div
          onClick={() =>
            setActiveFilter(activeFilter === nameFilter ? null : nameFilter)
          }
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilter === nameFilter,
          })}
        >
          исполнителю
        </div>
        {!!activeFilter &&
          activeFilter ===
            nameFilter(
              <div className={styles.filter_container}>
                <div className={styles.filter__list}>
                  {items.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>,
            )}
      </div>

      <div className={styles.filter__item}>
        <div
          onClick={() =>
            setActiveFilter(activeFilter === yearFilter ? null : yearFilter)
          }
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilter === yearFilter,
          })}
        >
          году выпуска
        </div>
      </div>
      <div className={styles.filter__item}>
        <div
          onClick={() =>
            setActiveFilter(activeFilter === genreFilter ? null : genreFilter)
          }
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilter === genreFilter,
          })}
        >
          жанру
        </div>
      </div>
    </div>
  );
}
