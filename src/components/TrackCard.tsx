import type { Track } from "@/types/types";
import styles from "./TrackCard.module.css";
import Image from "next/image";

export default function TrackCard({ track }: { track: Track }) {
  return (
    <div className={styles.card}>
      <Image
        className={styles.image}
        src={track.imageUrl}
        alt={track.title}
        width={160}
        height={160}
      />
      <h2 className={styles.trackTitle}>{track.title}</h2>
      <p>{track.artist}</p>
      <p>{track.isFavorite ? "❤️" : "♡"}</p>
    </div>
  );
}
