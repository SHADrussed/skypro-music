import { configureStore } from "@reduxjs/toolkit";
import player from "./playerSlice";
import auth from "./authSlice";
import favorites from "./favoritesSlice";

export const makeStore = () => configureStore({ reducer: { player, auth, favorites } });
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
