import { render, screen } from "@testing-library/react";
import { Header } from "../common/components/header/Header";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from 'vitest';

const OLD_DEPLOY_ENVIRONMENT = import.meta.env.VITE_DEPLOY_ENVIRONMENT;

const mockMatchMedia = () => {
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
  import.meta.env.VITE_DEPLOY_ENVIRONMENT = "prod"; // Make a copy
});

test("Should render Header/Nav without breaking", () => {
  mockMatchMedia();
  renderHeader();
  expect(screen.getByText("onRouteBc")).toBeInTheDocument();
});

test("Should render blue background for prod environment", () => {
  mockMatchMedia();
  const wrapper = render(
    <Router>
      <Header />
    </Router>
  );

  const header = wrapper.getByTestId("header-background");
  const styles = getComputedStyle(header);
  expect(styles.backgroundColor).toBe("rgb(0, 51, 102)"); //rgb(0, 51, 102) == #036

  import.meta.env.VITE_DEPLOY_ENVIRONMENT = OLD_DEPLOY_ENVIRONMENT; // reset env variable
});
