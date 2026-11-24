import { fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "@/components/SearchBar/SearchBar";

test("поле передаёт введённый текст родителю", () => {
  const setSearch = jest.fn();

  render(<SearchBar search="" setSearch={setSearch} />);

  const input = screen.getByRole("searchbox");

  fireEvent.change(input, { target: { value: "Искра" } });

  expect(setSearch).toHaveBeenCalledWith("Искра");
});

test("поле отображает значение, переданное родителем", () => {
  const setSearch = jest.fn();

  render(<SearchBar search="Рок" setSearch={setSearch} />);

  const input = screen.getByRole("searchbox");

  expect(input).toHaveValue("Рок");
});
