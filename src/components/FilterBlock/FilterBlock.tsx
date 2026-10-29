"use client";
import { useState } from "react";
import styles from "./FilterBlock.module.css";

export default function FilterBlock() {
  const [barSettings, setBarSettings] = useState({ isOpen: false, which: "" });

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>
      <div
        onClick={() =>
          setBarSettings({
            isOpen: !barSettings.isOpen,
            which: "author",
          })
        }
        className={styles.filter__button}
      >
        исполнителю
      </div>
      <div
        onClick={() =>
          setBarSettings({
            isOpen: !barSettings.isOpen,
            which: "year",
          })
        }
        className={styles.filter__button}
      >
        году выпуска
      </div>
      <div
        onClick={() =>
          setBarSettings({
            isOpen: !barSettings.isOpen,
            which: "genre",
          })
        }
        className={styles.filter__button}
      >
        жанру
      </div>
    </div>
  );
}
