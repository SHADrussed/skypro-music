"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setIsPlaying } from "@/store/playerSlice";
import cn from "classnames";
import Link from "next/link";
import styles from "./PlayerBar.module.css";

export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef(0);
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying } = useAppSelector(state => state.player);
  // Pending playback can be paused even before media is ready (isPlaying=false).
  const [playbackRequested, setPlaybackRequested] = useState(false);
  const [error, setError] = useState<{ source: string; message: string } | null>(null);

  const invalidatePlayback = useCallback(() => { ++requestRef.current; }, []);

  const startPlayback = useCallback((audio: HTMLAudioElement) => {
    const request = ++requestRef.current;
    const source = audio.src;
    setError(null);
    // play() alone keeps rejecting after a media error until load() resets it.
    if (audio.error) audio.load();
    setPlaybackRequested(true);
    void audio.play().catch((reason: unknown) => {
      // A superseded play() may reject after a new source has already started.
      if (request !== requestRef.current) return;
      setPlaybackRequested(false);
      dispatch(setIsPlaying(false));
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setError({ source, message: "Не удалось воспроизвести трек. Попробуйте ещё раз." });
    });
  }, [dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.track_file;
    startPlayback(audio);
    return () => {
      invalidatePlayback();
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      dispatch(setIsPlaying(false));
    };
  }, [currentTrack, dispatch, startPlayback, invalidatePlayback]);

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (audio.paused || audio.error) startPlayback(audio);
    else {
      ++requestRef.current;
      audio.pause();
    }
  }

  function syncPlayback() {
    const audio = audioRef.current;
    setPlaybackRequested(Boolean(audio && !audio.paused && !audio.ended && !audio.error));
    dispatch(setIsPlaying(Boolean(audio && !audio.paused && !audio.ended && audio.readyState >= 3)));
  }

  const canPause = isPlaying || playbackRequested;

  return (
    <div className={styles.bar}>
      <audio ref={audioRef} preload="none"
        onPlay={syncPlayback} onPlaying={syncPlayback} onPause={syncPlayback}
        onWaiting={() => dispatch(setIsPlaying(false))}
        onEnded={syncPlayback}
        onError={() => {
          const audio = audioRef.current;
          if (!audio?.error) return;
          ++requestRef.current;
          audio.pause();
          setPlaybackRequested(false);
          dispatch(setIsPlaying(false));
          setError({ source: audio.src, message: "Не удалось загрузить аудио. Источник недоступен." });
        }}
      />
      {error && error.source === currentTrack?.track_file && <p role="alert" className={styles.player__error}>{error.message}</p>}
      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}></div>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={styles.player__btnPrev}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <button type="button" className={cn(styles.player__btnPlay, styles.btn)}
                aria-label={canPause ? "Пауза" : "Воспроизвести"}
                disabled={!currentTrack} onClick={togglePlayback}>
                {canPause ? <svg className={styles.player__btnPlaySvg} viewBox="0 0 22 20" aria-hidden="true">
                  <path d="M3 0h5v20H3zM14 0h5v20h-5z" />
                </svg> : <svg className={styles.player__btnPlaySvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-play"></use>
                </svg>}
              </button>
              <div className={styles.player__btnNext}>
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div className={cn(styles.player__btnRepeat, styles.btnIcon)}>
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div className={cn(styles.player__btnShuffle, styles.btnIcon)}>
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="">
                    {currentTrack?.name ?? "Выберите трек"}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrack?.author ?? ""}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__dislike}>
                <div className={cn(styles.player__btnShuffle, styles.btnIcon)}>
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                {/* <div className={cn(styles.trackPlay__dislike, styles.btnIcon)}>
                  <svg className={styles.trackPlay__dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div> */}
              </div>
            </div>
          </div>
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={cn(styles.volume__progress, styles.btn)}>
                <input
                  className={cn(styles.volume__progressLine, styles.btn)}
                  type="range"
                  name="range"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
