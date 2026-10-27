import styles from "./ArtistCard.module.css";

export default function ArtistCard({ artist }: { artist: string }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.artistName}>{artist}</h2>
    </div>
  );
}
