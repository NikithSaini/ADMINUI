import { render, screen } from "@testing-library/react";
import ReactApp from "./ReactApp";

test("renders React application", () => {
  render(<ReactApp />);
  const appTitle = screen.getByText(/React App/i);
  expect(appTitle).toBeInTheDocument();
});
