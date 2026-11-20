import { filterTracks } from "@/lib/filterTracks";
import { tracks } from "../fixtures/tracks";

test("поиск, автор, жанр и сортировка применяются одновременно", () => {
  const input = Object.freeze([
    tracks[2],
    { ...tracks[0], _id: 4, author: "Другой исполнитель" },
    { ...tracks[0], _id: 5, genre: ["Джаз"] },
    { ...tracks[1], _id: 6, author: tracks[0].author, genre: ["Рок"] },
    tracks[0],
  ]);
  const apply = (order?: "ascending" | "descending") =>
    filterTracks(input, " ИСК ", tracks[0].author, "Рок", order).map((track) => track._id);

  expect(apply("ascending")).toEqual([1, 3]);
  expect(apply("descending")).toEqual([3, 1]);
  expect(apply()).toEqual([3, 1]);
  expect(input.map((track) => track._id)).toEqual([3, 4, 5, 6, 1]);
});

test("равные даты сохраняют порядок, пустой результат остаётся пустым", () => {
  const sameDate = { ...tracks[1], release_date: tracks[0].release_date };
  const input = [sameDate, tracks[0]];
  expect(filterTracks(input, "", "", "", "ascending")).toEqual(input);
  expect(filterTracks(input, "", "", "", "descending")).toEqual(input);
  expect(filterTracks(input, "", "", "Джаз", "ascending")).toEqual([]);
  expect(filterTracks([], "", "", "")).toEqual([]);
});

test.each(["ascending", "descending"] as const)(
  "треки без даты идут последними при сортировке %s",
  (order) => {
    const first = { ...tracks[0], release_date: "" };
    const last = { ...tracks[2], release_date: "" };
    expect(filterTracks([first, tracks[1], last], "", "", "", order)).toEqual([
      tracks[1], first, last,
    ]);
  },
);
