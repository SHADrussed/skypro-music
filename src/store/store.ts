import { configureStore } from "@reduxjs/toolkit";
import player from "./playerSlice";

export const makeStore = () => configureStore({ reducer: { player } });
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
