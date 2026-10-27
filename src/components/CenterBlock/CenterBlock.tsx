import ContentBlock from "@/components/ContentBlock/ContentBlock";
import FilterBlock from "@/components/FilterBlock/FilterBlock";
import SearchBar from "@/components/SearchBar/SearchBar";
import styles from "./CenterBlock.module.css";

export default function CenterBlock() {
  return (
    <div className={styles.centerblock}>
      <SearchBar />
      <h2 className={styles.centerblock__h2}>Треки</h2>
      <FilterBlock />
      <ContentBlock />
    </div>
  );
}
