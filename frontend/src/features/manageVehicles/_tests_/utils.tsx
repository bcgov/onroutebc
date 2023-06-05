import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";

/* Code taken from  https://github.com/TkDodo/testing-react-query/blob/main/src/tests/utils.tsx */

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => undefined,
    },
  });

export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>
      <Router>{ui}</Router>
    </QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          {rerenderUi}
        </QueryClientProvider>
      ),
  };
}

export function createWrapper() {
  const testQueryClient = createTestQueryClient();
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      <Router>{children}</Router>
    </QueryClientProvider>
  );
}

// HELPERS
export const clickSubmit = () => {
  user.click(screen.getByRole("button", { name: /Add To Inventory/i }));
};

// HELPERS: Get Fields
export const getUnitNumber = () => {
  return screen.getByRole("textbox", {
    name: /unitNumber/i,
  });
};

export const getMake = () => {
  return screen.getByRole("textbox", {
    name: /make/i,
  });
};

export const getYear = () => {
  // "year" field is now of type="number" (ie. role of "spinbutton")
  return screen.getByRole("spinbutton", {
    name: /year/i,
  });
};

export const getVIN = () => {
  return screen.getByRole("textbox", {
    name: /vin/i,
  });
};

export const getPlate = () => {
  return screen.getByRole("textbox", {
    name: /plate/i,
  });
};

export const getTrailerTypeCode = () => {
  return screen.getByRole("button", {
    name: /trailerTypeCode/i,
  });
};

export const getPowerUnitTypeCode = () => {
  return screen.getByRole("button", {
    name: /powerUnitTypeCode/i,
  });
};

export const getCountry = () => {
  return screen.getByRole("button", {
    name: /countryCode/i,
  });
};

export const getProvince = () => {
  return screen.getByRole("button", {
    name: /provinceCode/i,
  });
};

export const getEmptyTrailerWidth = () => {
  return screen.getByRole("textbox", {
    name: /emptyTrailerWidth/i,
  });
};

export const getLicensedGvw = () => {
  // "licensedGvw" field is now of type="number" (ie. role of "spinbutton")
  return screen.getByRole("spinbutton", {
    name: /licensedGvw/i,
  });
};

export const getSteerAxleTireSize = () => {
  return screen.getByRole("textbox", {
    name: /steerAxleTireSize/i,
  });
};
