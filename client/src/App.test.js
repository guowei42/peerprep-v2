import { render, screen } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

test('renders "PeerPrep" toolbar', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const toolbar = screen.getByText(/PeerPrep/i);
  expect(toolbar).toBeInTheDocument();
});
