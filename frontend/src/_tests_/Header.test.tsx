import { render, screen } from "@testing-library/react";
import { Header } from "../common/components/header/Header";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from 'vitest';

const mockMatchMedia = () => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    envConfig: vi.fn(),
    matches: query !== "(max-width: 768px)",
    media: "",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
};

const renderHeader = () => {
  render(
    <Router>
      <Header />
    </Router>
  );
};

beforeEach(() => {
  vi.resetModules();
});

test("Should render Header/Nav without breaking", () => {
  mockMatchMedia();
  renderHeader();
  expect(screen.getByText("onRouteBc")).toBeInTheDocument();
});

