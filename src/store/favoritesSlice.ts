import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Track } from "@/types/types";

type FavoritesState = { tracks: Track[]; loading: boolean; error: string | null; owner: number | null };
const initialState: FavoritesState = { tracks: [], loading: false, error: null, owner: null };
const slice = createSlice({ name: "favorites", initialState, reducers: {
  begin(state, { payload }: PayloadAction<number>) { state.loading = true; state.error = null; state.owner = payload; state.tracks = []; },
  loaded(state, { payload }: PayloadAction<{ owner: number; tracks: Track[] }>) {
    if (state.owner !== payload.owner) return;
    state.loading = false; state.tracks = payload.tracks;
  },
  failed(state, { payload }: PayloadAction<string>) { state.loading = false; state.error = payload; },
  clear() { return initialState; },
  add(state, { payload }: PayloadAction<Track>) { if (!state.tracks.some(track => track._id === payload._id)) state.tracks.push(payload); },
  remove(state, { payload }: PayloadAction<number>) { state.tracks = state.tracks.filter(track => track._id !== payload); },
} });
export const { begin, loaded, failed, clear, add, remove } = slice.actions;
export default slice.reducer;
