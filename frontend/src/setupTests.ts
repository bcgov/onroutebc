// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

(global as any).envConfig = (() => {
  return {
    VITE_DEPLOY_ENVIRONMENT: "docker",
    VITE_API_VEHICLE_URL: "http://localhost:5000",
    VITE_API_MANAGE_PROFILE_URL: "http://localhost:5000",
  };
})();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));
