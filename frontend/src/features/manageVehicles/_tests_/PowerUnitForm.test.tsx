import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { vi } from "vitest";

vi.mock("../apiManager/endpoints/endpoints", () => ({
  VEHICLE_URL: "test",
  VEHICLES_API: "test",
}));

vi.mock("../apiManager/vehiclesAPI", () => ({
  getAllPowerUnits: vi.fn(),
  getPowerUnitTypes: vi.fn(),
  addPowerUnit: vi.fn(),
  updatePowerUnit: vi.fn(),
}));

const globalAny: any = global;

import * as endpoints from "../apiManager/endpoints/endpoints";
import * as vehiclesAPI from "../apiManager/vehiclesAPI";

console.log("endpoints", endpoints);
console.log("vehiclesAPI", vehiclesAPI);

test("direct global variable", () => {
  expect(endpoints.VEHICLE_URL).toBe("test");
  expect(endpoints.VEHICLES_API).toBe("test");
});

import { PowerUnitForm } from "../components/form/PowerUnitForm";

const setStateMock = vi.fn();
const queryClient = new QueryClient();

vi.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => undefined),
      },
    };
  },
}));

beforeEach(() => {
  vi.resetModules();
  renderComponent();
});

const renderComponent = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <PowerUnitForm setShowAddVehicle={setStateMock} />
    </QueryClientProvider>
  );
};

const clickSubmit = () => {
  user.click(screen.getByRole("button", { name: /Add To Inventory/i }));
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

test("Should render Power Unit Form without breaking", () => {
  expect(
    screen.getByText("vehicle.power-unit.unit-number")
  ).toBeInTheDocument();
});

// test("Should show error when submitting empty VIN field", async () => {
//   clickSubmit();
//   expect(await screen.findByTestId("alert-vin")).toBeInTheDocument();
// });

// test("Should show error when submitting VIN with 5 characters", async () => {
//   const vinTextField = screen.getByRole("textbox", {
//     name: /vin/i,
//   });

//   await act(async () => {
//     fireEvent.change(vinTextField, { target: { value: "12345" } });
//   });

//   expect(vinTextField).toHaveValue("12345");

//   clickSubmit();

//   expect(await screen.findByTestId("alert-vin")).toHaveTextContent(
//     "VIN is required."
//   );
// });

// test("Should NOT show error when submitting VIN with 6 characters", async () => {
//   const vinTextField = screen.getByRole("textbox", {
//     name: /vin/i,
//   });

//   await act(async () => {
//     fireEvent.change(vinTextField, { target: { value: "123456" } });
//   });

//   expect(vinTextField).toHaveValue("123456");

//   clickSubmit();

//   await act(async () => {
//     await sleep(1000);
//   });

//   expect(screen.queryByTestId("alert-vin")).toBeNull();
// });
