import { fireEvent, render, screen } from "@testing-library/react";
import type { Track } from "@/types/types";
import FilterBlock from "@/components/FilterBlock/FilterBlock";
import { tracks } from "../fixtures/tracks";

const mockDispatch = jest.fn();
jest.mock("@/store/hooks", () => ({ useAppDispatch: () => mockDispatch }));
jest.mock("@/components/ContentBlock/ContentBlock", () => ({
  __esModule: true,
  default: ({ tracks }: { tracks: Track[] }) => (
    <ol aria-label="Треки">{tracks.map(track => <li key={track._id}>{track.name}</li>)}</ol>
  ),
}));

test.each([
  ["исполнителю", "Первый исполнитель"],
  ["жанру", "Рок"],
  ["году выпуска", "По убыванию"],
])("повторный выбор снимает фильтр по %s", (category, option) => {
  render(<FilterBlock tracks={tracks} search="" />);
  fireEvent.click(screen.getByRole("button", { name: category }));
  fireEvent.click(screen.getByRole("button", { name: option }));
  expect(screen.getByRole("button", { name: "Сбросить фильтры" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: category }));
  const selectedOption = screen.getByRole("button", { name: option });
  expect(selectedOption).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(selectedOption);
  expect(screen.getByRole("button", { name: "Сбросить фильтры" })).toBeDisabled();
  expect(screen.getAllByRole("listitem").map(item => item.textContent)).toEqual(tracks.map(track => track.name));
});

test("общий сброс очищает автора, жанр и сортировку, сохраняя поиск", () => {
  render(<FilterBlock tracks={tracks} search="иск" />);
  for (const [category, option] of [["исполнителю", "Первый исполнитель"], ["жанру", "Рок"], ["году выпуска", "По убыванию"]]) {
    fireEvent.click(screen.getByRole("button", { name: category }));
    fireEvent.click(screen.getByRole("button", { name: option }));
  }
  expect(screen.getAllByRole("listitem").map(item => item.textContent)).toEqual(["Искры", "Искра"]);
  fireEvent.click(screen.getByRole("button", { name: "Сбросить фильтры" }));
  expect(screen.getAllByRole("listitem").map(item => item.textContent)).toEqual(["Искра", "Искры"]);
  expect(screen.getByRole("button", { name: "Сбросить фильтры" })).toBeDisabled();
  for (const [category, option] of [["исполнителю", "Первый исполнитель"], ["жанру", "Рок"], ["году выпуска", "По убыванию"]]) {
    fireEvent.click(screen.getByRole("button", { name: category }));
    expect(screen.getByRole("button", { name: option })).toHaveAttribute("aria-pressed", "false");
  }
});

test("варианты берутся из исходных треков и сброс восстанавливает пустой результат", () => {
  render(<FilterBlock tracks={tracks} search="иск" />);
  fireEvent.click(screen.getByRole("button", { name: "исполнителю" }));
  fireEvent.click(screen.getByRole("button", { name: "Второй исполнитель" }));
  expect(screen.getByText("Нет подходящих треков")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Сбросить фильтры" }));
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});
