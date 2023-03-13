// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import "dotenv/config";

const globalAny: any = global;

// setup-teardown-hook.js
import { afterAll, beforeAll } from "vitest";
beforeAll(() => {
  globalAny.envConfig = (() => {
    return {
      VITE_DEPLOY_ENVIRONMENT: "docker",
      VITE_API_VEHICLE_URL: "http://localhost:5000",
      VITE_API_MANAGE_PROFILE_URL: "http://localhost:5000",
    };
  })();
});

afterAll(() => {
  delete globalAny.envConfig;
});
