import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import CenterBlock from "@/components/CenterBlock/CenterBlock";
import { makeStore } from "@/store/store";
import { tracks } from "../fixtures/tracks";

test("поиск обновляет список и очередь плеера, а очистка восстанавливает треки", () => {
  const store = makeStore();
  render(
    <Provider store={store}>
      <CenterBlock tracks={tracks} />
    </Provider>,
  );
  const search = screen.getByRole("searchbox", { name: "Поиск треков" });
  const visibleTracks = () => screen.queryAllByRole("button", { name: /^Воспроизвести / });

  expect(visibleTracks()).toHaveLength(3);
  fireEvent.change(search, { target: { value: "  ИСК " } });

  expect(visibleTracks()).toHaveLength(2);
  expect(screen.getByRole("button", { name: "Воспроизвести Искра" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Воспроизвести Искры" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Воспроизвести Ночная искра" })).not.toBeInTheDocument();
  expect(store.getState().player.playlist.map((track) => track._id)).toEqual([1, 3]);

  fireEvent.change(search, { target: { value: "ничего" } });
  expect(visibleTracks()).toHaveLength(0);
  expect(screen.getByText("Нет подходящих треков")).toBeInTheDocument();
  expect(store.getState().player.playlist).toEqual([]);

  fireEvent.change(search, { target: { value: "" } });
  expect(visibleTracks()).toHaveLength(3);
  expect(store.getState().player.playlist).toEqual(tracks);
});
