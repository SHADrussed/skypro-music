import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import CenterBlock from "@/components/CenterBlock/CenterBlock";
import { tracks } from "../fixtures/tracks";

test("ввод в поиск фильтрует отображаемые треки", () => {
  render(
    <Provider store={makeStore()}>
      <CenterBlock tracks={tracks} />
    </Provider>,
  );

  // Введи «иск» в поле поиска.
  // Проверь два оставшихся названия и отсутствие третьего.
  expect(screen.getByText("название")).toBeInTheDocument();
  expect(screen.queryByText("другое название")).not.toBeInTheDocument();
});
