import { formatDuration } from "@/lib/formatDuration";

test.each([
  [0, "00:00"],
  [59.9, "00:59"],
  [60, "01:00"],
  [3605, "60:05"],
  [-1, "00:00"],
  [NaN, "00:00"],
  [Infinity, "00:00"],
])("форматирует %s секунд как %s", (value, expected) => {
  expect(formatDuration(value)).toBe(expected);
});
