import { expect, test } from "@jest/globals";
import { searchTracks } from "@/lib/searchTracks";
import { tracks } from "../fixtures/tracks";

test("поиск игнорирует регистр и пробелы по краям", () => {
  const result = searchTracks(tracks, " ИсК ");

  expect(result).toEqual([tracks[0], tracks[2]]);
});

test("пустой запрос возвращает все треки", () => {
  const result = searchTracks(tracks, "");

  expect(result).toEqual(tracks);
});

test("запрос 'несуществующий' возвращает пустой массив", () => {
  const result = searchTracks(tracks, "несуществующий");

  expect(result).toEqual([]);
});
