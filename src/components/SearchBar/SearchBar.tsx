import styles from "./SearchBar.module.css";

export default function SearchBar() {
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
      />
    </div>
  );
}
