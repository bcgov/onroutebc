import { render, screen } from "@testing-library/react";
import { Header } from "../common/components/header/Header";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from 'vitest';

const mockMatchMedia = () => {
  Object.defineProperty(window, 'envConfig', {
    value: {
      VITE_DEPLOY_ENVIRONMENT: "docker",
      VITE_API_VEHICLE_URL: "http://localhost:5000",
    },
  });

  window.matchMedia = vi.fn().mockImplementation((query) => ({
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
  expect(screen.getByText("onRouteBC")).toBeInTheDocument();
});

