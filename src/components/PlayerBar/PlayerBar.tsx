"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setIsPlaying, nextTrack, previousTrack, toggleShuffle, toggleLoop, setVolume, canGoNext, canGoPrevious } from "@/store/playerSlice";
import cn from "classnames";
import Link from "next/link";
import styles from "./PlayerBar.module.css";

function formatTime(value: number) {
  const seconds = Math.max(0, Math.floor(value));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef(0);
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying, isShuffle, isLoop, volume } = useAppSelector(state => state.player);
  const hasNext = useAppSelector(state => canGoNext(state.player));
  const hasPrevious = useAppSelector(state => canGoPrevious(state.player));
  const [progress, setProgress] = useState({ source: "", time: 0, duration: 0 });
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

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function syncProgress() {
    const audio = audioRef.current;
    if (!audio) return;
    const duration = Number.isFinite(audio.duration) ? Math.max(0, audio.duration) : 0;
    setProgress({ source: audio.getAttribute("src") ?? "", time: Math.min(Math.max(0, audio.currentTime), duration), duration });
  }

  const duration = progress.source === currentTrack?.track_file ? progress.duration : 0;
  const currentTime = progress.source === currentTrack?.track_file ? progress.time : 0;

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio || !duration || !Number.isFinite(value)) return;
    audio.currentTime = Math.min(duration, Math.max(0, value));
    syncProgress();
  }

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
      <audio ref={audioRef} preload="none" loop={isLoop}
        onPlay={syncPlayback} onPlaying={syncPlayback} onPause={syncPlayback}
        onLoadedMetadata={syncProgress} onDurationChange={syncProgress} onTimeUpdate={syncProgress} onEmptied={syncProgress}
        onSeeking={() => dispatch(setIsPlaying(false))}
        onSeeked={() => { syncProgress(); syncPlayback(); }}
        onVolumeChange={() => { if (audioRef.current) dispatch(setVolume(audioRef.current.volume)); }}
        onWaiting={() => dispatch(setIsPlaying(false))}
        onEnded={() => {
          syncPlayback(); syncProgress();
          // Native loop has priority and normally prevents ended from firing.
          if (!audioRef.current?.loop) dispatch(nextTrack());
        }}
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
        <input className={styles.bar__playerProgress} type="range" aria-label="Позиция воспроизведения"
          min={0} max={duration || 1} step={0.01} value={currentTime} disabled={!duration}
          aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
          style={{ background: `linear-gradient(to right, #b672ff ${duration ? currentTime / duration * 100 : 0}%, #2e2e2e 0%)` }}
          onChange={event => seek(Number(event.target.value))} />
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <button type="button" aria-label="Предыдущий трек" disabled={!hasPrevious}
                onClick={() => dispatch(previousTrack())} className={styles.player__btnPrev}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </button>
              <button type="button" className={cn(styles.player__btnPlay, styles.btn)}
                aria-label={canPause ? "Пауза" : "Воспроизвести"}
                disabled={!currentTrack} onClick={togglePlayback}>
                {canPause ? <svg className={styles.player__btnPlaySvg} viewBox="0 0 22 20" aria-hidden="true">
                  <path d="M3 0h5v20H3zM14 0h5v20h-5z" />
                </svg> : <svg className={styles.player__btnPlaySvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-play"></use>
                </svg>}
              </button>
              <button type="button" aria-label="Следующий трек" disabled={!hasNext}
                onClick={() => dispatch(nextTrack())} className={styles.player__btnNext}>
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </button>
              <button type="button" aria-label="Повтор трека" aria-pressed={isLoop}
                onClick={() => dispatch(toggleLoop())} className={cn(styles.player__btnRepeat, styles.btnIcon)}>
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </button>
              <button type="button" aria-label="Случайный порядок" aria-pressed={isShuffle}
                onClick={() => dispatch(toggleShuffle())} className={cn(styles.player__btnShuffle, styles.btnIcon)}>
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </button>
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
            <span className={styles.player__time} data-testid="playback-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
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
                  aria-label="Громкость" min={0} max={1} step={0.01} value={volume}
                  onChange={event => dispatch(setVolume(Number(event.target.value)))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
