import { canGoNext, canGoPrevious } from "@/store/playerSelectors";
import { makeStore } from "@/store/store";
import { nextTrack, resetPlayer, selectTrack, setPlaylist, toggleShuffle } from "@/store/playerSlice";
import { tracks } from "../fixtures/tracks";

test("навигация следует видимому порядку и отключается на его границах", () => {
  const store = makeStore();
  const navigation = () => [canGoPrevious(store.getState().player), canGoNext(store.getState().player)];
  store.dispatch(setPlaylist(tracks));
  expect(navigation()).toEqual([false, false]);
  store.dispatch(selectTrack(tracks[0]));
  expect(navigation()).toEqual([false, true]);
  store.dispatch(selectTrack(tracks[2]));
  expect(navigation()).toEqual([true, false]);
  store.dispatch(setPlaylist([]));
  expect(navigation()).toEqual([false, false]);
});

test("случайный порядок учитывает историю и число доступных треков", () => {
  const store = makeStore();
  const navigation = () => [canGoPrevious(store.getState().player), canGoNext(store.getState().player)];
  store.dispatch(setPlaylist(tracks));
  store.dispatch(selectTrack(tracks[0]));
  store.dispatch(toggleShuffle());
  expect(navigation()).toEqual([false, true]);
  store.dispatch(nextTrack());
  expect(navigation()).toEqual([true, true]);
  store.dispatch(setPlaylist([tracks[0]]));
  expect(navigation()).toEqual([false, false]);
});

test("сброс плеера при выходе сохраняет отфильтрованную очередь", () => {
  const store = makeStore();
  const visibleTracks = [tracks[2]];
  store.dispatch(setPlaylist(visibleTracks));
  store.dispatch(selectTrack(visibleTracks[0]));
  store.dispatch(resetPlayer());
  expect(store.getState().player.currentTrack).toBeNull();
  expect(store.getState().player.playlist).toEqual(visibleTracks);
  store.dispatch(selectTrack(visibleTracks[0]));
  expect(store.getState().player.currentTrack?._id).toBe(visibleTracks[0]._id);
});
