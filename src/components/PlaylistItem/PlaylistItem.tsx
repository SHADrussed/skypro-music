"use client";

import type { Track } from "@/types/types";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTrack } from "@/store/playerSlice";
import { formatDuration } from "@/lib/formatDuration";
import styles from "./PlaylistItem.module.css";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { memo } from "react";

function PlaylistItem({ track }: { track: Track }) {
  const dispatch = useAppDispatch();
  const isCurrent = useAppSelector(state => state.player.currentTrack?._id === track._id);
  const isPlaying = useAppSelector(state => state.player.currentTrack?._id === track._id && state.player.isPlaying);
  return (
    <div className={styles.playlist__item}>
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            {isCurrent ? <span
              aria-label={isPlaying ? "Трек воспроизводится" : "Текущий трек"}
              data-testid="playback-indicator"
              data-playing={isPlaying}
              className={cn(styles.track__indicator, { [styles.track__indicatorPlaying]: isPlaying })}
            /> : <svg className={styles.track__titleSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>}
          </div>
          <div className={"track__title-text"}>
            <button type="button" className={styles.track__titleLink}
              aria-label={`Воспроизвести ${track.name}`}
              onClick={() => dispatch(selectTrack(track))}>
              {track.name} <span className={styles.track__titleSpan}></span>
            </button>
          </div>
        </div>
        <div className={styles.track__author}>
          <Link className={styles.track__authorLink} href="">
            {track.author}
          </Link>
        </div>
        <div className={styles.track__album}>
          <Link className={styles.track__albumLink} href="">
            {track.album}
          </Link>
        </div>
        <div className={styles.track__time}>
          <FavoriteButton track={track} />
          <span className={styles.track__timeText}>
            {formatDuration(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
export default memo(PlaylistItem);
