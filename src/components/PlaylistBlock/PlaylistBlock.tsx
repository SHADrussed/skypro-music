import type { Track } from "@/types/types";
import PlaylistItem from "@/components/PlaylistItem/PlaylistItem";
import styles from "./PlaylistBlock.module.css";

export default function PlaylistBlock({ tracks }: { tracks: Track[] }) {
  return (
    <div className={styles.content__playlist}>
      {tracks.map((track) => (
        <PlaylistItem key={track._id} track={track} />
      ))}
    </div>
  );
}
