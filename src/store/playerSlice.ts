import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Track } from "@/types/types";

type PlayerState = { currentTrack: Track | null; isPlaying: boolean };
const initialState: PlayerState = { currentTrack: null, isPlaying: false };

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    selectTrack(state, { payload }: PayloadAction<Track>) {
      // A fresh selection also restarts the same track after pause/end/error.
      state.currentTrack = { ...payload };
      state.isPlaying = false;
    },
    setIsPlaying(state, { payload }: PayloadAction<boolean>) {
      state.isPlaying = state.currentTrack !== null && payload;
    },
  },
});

export const { selectTrack, setIsPlaying } = playerSlice.actions;
export default playerSlice.reducer;
