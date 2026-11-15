import FilterBlock from "@/components/FilterBlock/FilterBlock";
import SearchBar from "@/components/SearchBar/SearchBar";
import styles from "./CenterBlock.module.css";
import type { Track } from "@/types/types";

export default function CenterBlock({ tracks, title = "Треки" }: { tracks: Track[]; title?: string }) {
  return (
    <div className={styles.centerblock}>
      <SearchBar />
      <h2 className={styles.centerblock__h2}>{title}</h2>
      <FilterBlock tracks={tracks} />
    </div>
  );
}
