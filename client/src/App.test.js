import { render, screen } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

test('renders "PeerPrep" text (in toolbar)', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const peerprep = screen.getByText(/PeerPrep/i);
  expect(peerprep).toBeInTheDocument();
});
