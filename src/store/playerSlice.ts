import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Track } from "@/types/types";
import { data } from "@/data/data";
import { canGoNext, canGoPrevious } from "./playerSelectors";

export { canGoNext, canGoPrevious } from "./playerSelectors";

export type PlayerState = {
  currentTrack: Track | null;
  isPlaying: boolean;
  playlist: Track[];
  isShuffle: boolean;
  isLoop: boolean;
  volume: number;
  history: number[];
  historyIndex: number;
  remaining: number[];
};
const initialState: PlayerState = {
  currentTrack: null, isPlaying: false, playlist: data,
  isShuffle: false, isLoop: false, volume: 1,
  history: [], historyIndex: -1, remaining: [],
};

function changeTrack(state: PlayerState, track: Track) {
  state.currentTrack = { ...track };
  state.isPlaying = false;
}

function resetShuffle(state: PlayerState) {
  state.history = state.currentTrack ? [state.currentTrack._id] : [];
  state.historyIndex = state.history.length - 1;
  state.remaining = state.playlist.filter(track => track._id !== state.currentTrack?._id).map(track => track._id);
}

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    resetPlayer(state) {
      return { ...initialState, playlist: state.playlist };
    },
    setPlaylist(state, { payload }: PayloadAction<Track[]>) { state.playlist = payload; resetShuffle(state); },
    selectTrack(state, { payload }: PayloadAction<Track>) {
      if (!state.playlist.some(track => track._id === payload._id)) return;
      changeTrack(state, payload);
      resetShuffle(state);
    },
    setIsPlaying(state, { payload }: PayloadAction<boolean>) {
      state.isPlaying = state.currentTrack !== null && payload;
    },
    nextTrack: {
      // Randomness belongs in the action, keeping reducers deterministic/replayable.
      prepare: () => ({ payload: Math.random() }),
      reducer(state, { payload }: PayloadAction<number>) {
        if (!canGoNext(state)) return;
        if (!state.isShuffle) {
          const index = state.playlist.findIndex(track => track._id === state.currentTrack?._id);
          changeTrack(state, state.playlist[index + 1]);
          return;
        }
        let id: number;
        if (state.historyIndex < state.history.length - 1) {
          id = state.history[++state.historyIndex];
        } else {
          if (!state.remaining.length) {
            state.remaining = state.playlist.filter(track => track._id !== state.currentTrack?._id).map(track => track._id);
          }
          const index = Math.min(state.remaining.length - 1, Math.max(0, Math.floor(payload * state.remaining.length)));
          [id] = state.remaining.splice(index, 1);
          state.history.push(id);
          state.historyIndex++;
        }
        const track = state.playlist.find(track => track._id === id);
        if (track) changeTrack(state, track);
      },
    },
    previousTrack(state) {
      if (!canGoPrevious(state)) return;
      if (state.isShuffle) state.historyIndex--;
      const track = state.isShuffle
        ? state.playlist.find(track => track._id === state.history[state.historyIndex])
        : state.playlist[state.playlist.findIndex(track => track._id === state.currentTrack?._id) - 1];
      if (track) changeTrack(state, track);
    },
    toggleShuffle(state) {
      state.isShuffle = !state.isShuffle;
      resetShuffle(state);
    },
    toggleLoop(state) { state.isLoop = !state.isLoop; },
    setVolume(state, { payload }: PayloadAction<number>) {
      if (Number.isFinite(payload)) state.volume = Math.min(1, Math.max(0, payload));
    },
  },
});

export const { resetPlayer, setPlaylist, selectTrack, setIsPlaying, nextTrack, previousTrack, toggleShuffle, toggleLoop, setVolume } = playerSlice.actions;
export default playerSlice.reducer;
