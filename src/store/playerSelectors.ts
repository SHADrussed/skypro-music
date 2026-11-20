import type { PlayerState } from "./playerSlice";

export const canGoPrevious = (state: PlayerState) => state.currentTrack !== null && (
  state.isShuffle ? state.historyIndex > 0 : state.playlist.findIndex(track => track._id === state.currentTrack?._id) > 0
);
export const canGoNext = (state: PlayerState) => state.currentTrack !== null && (
  state.isShuffle ? state.playlist.length > 1 : state.playlist.findIndex(track => track._id === state.currentTrack?._id) < state.playlist.length - 1
);
