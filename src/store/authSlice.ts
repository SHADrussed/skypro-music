import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "@/lib/session";

type AuthState = { session: Session | null; ready: boolean };
const initialState: AuthState = { session: null, ready: false };
const authSlice = createSlice({ name: "auth", initialState, reducers: {
  setSession(state, { payload }: PayloadAction<Session | null>) { state.session = payload; state.ready = true; },
} });
export const { setSession } = authSlice.actions;
export default authSlice.reducer;
