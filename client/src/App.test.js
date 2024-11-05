import { render, screen } from '@testing-library/react';
import App from './App';

test('renders "PeerPrep" toolbar', () => {
  render(<App />);
  const toolbar = screen.getByText(/PeerPrep/i);
  expect(toolbar).toBeInTheDocument();
});
