import styles from "./SearchBar.module.css";

export default function SearchBar({
  search,
  setSearch,
}: {
  search: string;

  setSearch: (query: string) => void;
}) {
  return (
    <div className={styles.centerblock__search}>
      <svg className={styles.search__svg}>
        <use xlinkHref="/img/icon/sprite.svg#icon-search" />
      </svg>
      <input
        className={styles.search__text}
        type="search"
        placeholder="Поиск"
        name="search"
        aria-label="Поиск треков"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
    </div>
  );
}
