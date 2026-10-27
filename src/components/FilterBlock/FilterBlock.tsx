import styles from "./FilterBlock.module.css";

export default function FilterBlock() {
  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>
      <div className={styles.filter__button}>исполнителю</div>
      <div className={styles.filter__button}>году выпуска</div>
      <div className={styles.filter__button}>жанру</div>
    </div>
  );
}
