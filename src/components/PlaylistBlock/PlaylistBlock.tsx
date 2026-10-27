import { data } from "@/data/data";
import PlaylistItem from "@/components/PlaylistItem/PlaylistItem";
import styles from "./PlaylistBlock.module.css";

export default function PlaylistBlock() {
  return (
    <div className={styles.content__playlist}>
      {data.map((track) => (
        <PlaylistItem key={track._id} track={track} />
      ))}
    </div>
  );
}
