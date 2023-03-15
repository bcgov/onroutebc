import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { vi } from "vitest";

import { PowerUnitForm } from "../components/form/PowerUnitForm";

// API Mocks - API Tests not yet implemented
vi.mock("../apiManager/endpoints/endpoints", () => ({
  VEHICLE_URL: "test",
  VEHICLES_API: {
    GET_ALL_POWER_UNITS: "test",
    POWER_UNIT: "test",
    POWER_UNIT_TYPES: "test",
  },
}));

vi.mock("../apiManager/vehiclesAPI", () => ({
  getAllPowerUnits: vi.fn(),
  getPowerUnitTypes: vi.fn(),
  addPowerUnit: vi.fn(),
  updatePowerUnit: vi.fn(),
}));

const setStateMock = vi.fn();
const queryClient = new QueryClient();

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

describe("All Power Unit Form Fields", () => {
  it("Should render all key form elements", () => {
    const unitNumber = getUnitNumber();
    const make = getMake();
    const year = getYear();
    const vin = getVIN();
    const plate = getPlate();
    const powerUnitTypeCode = getVehicleSubType();
    const country = getCountry();
    const province = getProvince();
    const licensedGvw = getLicensedGvw();
    const steerAxleTireSize = getSteerAxleTireSize();

    expect(unitNumber).toBeInTheDocument();
    expect(make).toBeInTheDocument();
    expect(year).toBeInTheDocument();
    expect(vin).toBeInTheDocument();
    expect(plate).toBeInTheDocument();
    expect(powerUnitTypeCode).toBeInTheDocument();
    expect(country).toBeInTheDocument();
    expect(province).toBeInTheDocument();
    expect(licensedGvw).toBeInTheDocument();
    expect(steerAxleTireSize).toBeInTheDocument();
  });
});

describe("Power Unit Form: Test VIN field", () => {
  it("Should show error when submitting empty VIN field", async () => {
    clickSubmit();
    expect(await screen.findByTestId("alert-vin")).toBeInTheDocument();
  });

  it("Should show error when submitting VIN with 5 characters", async () => {
    const vinTextField = screen.getByRole("textbox", {
      name: /vin/i,
    });

    await act(async () => {
      fireEvent.change(vinTextField, { target: { value: "12345" } });
    });

    expect(vinTextField).toHaveValue("12345");

    clickSubmit();

    expect(await screen.findByTestId("alert-vin")).toHaveTextContent(
      "Length must be 6"
    );
  });

  it("Should NOT show error when submitting VIN with 6 characters", async () => {
    const vinTextField = screen.getByRole("textbox", {
      name: /vin/i,
    });

    await act(async () => {
      fireEvent.change(vinTextField, { target: { value: "123456" } });
    });

    expect(vinTextField).toHaveValue("123456");

    clickSubmit();

    // Set timeout to allow time for queryByTestId to run.
    // findByTestId (which is async) did not work
    await act(async () => {
      await sleep(1000);
    });
    expect(screen.queryByTestId("alert-vin")).toBeNull();
  });
});

describe("Power Unit Form Submission", () => {
  it("TODO: Should successfully call API", async () => {
    const unitNumber = screen.getByRole("textbox", {
      name: /unitNumber/i,
    });
    const make = screen.getByRole("textbox", {
      name: /make/i,
    });
    const year = screen.getByRole("textbox", {
      name: /year/i,
    });
    const vin = screen.getByRole("textbox", {
      name: /vin/i,
    });
    const plate = screen.getByRole("textbox", {
      name: /plate/i,
    });
    const licensedGvw = screen.getByRole("textbox", {
      name: /licensedGvw/i,
    });
    const steerAxleTireSize = getSteerAxleTireSize();

    await act(async () => {
      fireEvent.input(unitNumber, { target: { value: "Ken10" } });
      fireEvent.input(make, { target: { value: "Kenworth" } });
      fireEvent.input(year, { target: { value: "2020" } });
      fireEvent.input(vin, { target: { value: "123456" } });
      fireEvent.input(plate, { target: { value: "ABC123" } });

      fireEvent.input(licensedGvw, { target: { value: "85000" } });
      fireEvent.input(steerAxleTireSize, { target: { value: "300" } });
    });

    clickSubmit();

    await act(async () => {
      await sleep(1000);
    });

    // Still need to test the API
    // Still need to figure out how to test MUI Select dropdowns

    expect(
      await screen.findByTestId("alert-powerUnitTypeCode")
    ).toHaveTextContent("Vehicle Sub-type is required.");
    expect(licensedGvw).toHaveValue("85000");
  });
});

// HELPERS
const clickSubmit = () => {
  user.click(screen.getByRole("button", { name: /Add To Inventory/i }));
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// HELPERS: Get Fields
const getUnitNumber = () => {
  return screen.getByRole("textbox", {
    name: /unitNumber/i,
  });
};

const getMake = () => {
  return screen.getByRole("textbox", {
    name: /make/i,
  });
};

const getYear = () => {
  return screen.getByRole("textbox", {
    name: /year/i,
  });
};

const getVIN = () => {
  return screen.getByRole("textbox", {
    name: /vin/i,
  });
};

const getPlate = () => {
  return screen.getByRole("textbox", {
    name: /plate/i,
  });
};

const getVehicleSubType = () => {
  return screen.getByRole("button", {
    name: /powerUnitTypeCode/i,
  });
};

const getCountry = () => {
  return screen.getByRole("button", {
    name: /country/i,
  });
};

const getProvince = () => {
  return screen.getByRole("button", {
    name: /province/i,
  });
};

const getLicensedGvw = () => {
  return screen.getByRole("textbox", {
    name: /licensedGvw/i,
  });
};

const getSteerAxleTireSize = () => {
  return screen.getByRole("textbox", {
    name: /steerAxleTireSize/i,
  });
};
