import { render, screen } from "@testing-library/react";
import { Header } from "../common/components/header/Header";
import { BrowserRouter as Router } from "react-router-dom";

const mockMatchMedia = () => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query !== "(max-width: 768px)",
    media: "",
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
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
  jest.resetModules();
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

  process.env.REACT_APP_DEPLOY_ENVIRONMENT = "prod";
  const header = wrapper.getByTestId("header-background");
  const styles = getComputedStyle(header);
  expect(styles.backgroundColor).toBe("rgb(0, 51, 102)"); //rgb(0, 51, 102) == #036
});
