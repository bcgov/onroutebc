import { act, fireEvent, screen, within } from "@testing-library/react";
import user from "@testing-library/user-event";

import { vi } from "vitest";
import { PowerUnitForm } from "../components/form/PowerUnitForm";
import { renderWithClient } from "./utils";

// Temp solution for mocking React Query to test the getPowerUnitTypes API call
vi.mock("@tanstack/react-query", async () => {
  const actual: any = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn().mockReturnValue({
      data: [
        {
          typeCode: "CONCRET",
          type: "Concrete Pumper Trucks",
          description:
            "Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.",
        },
      ],
      isLoading: false,
      error: {},
    }),
  };
});

beforeEach(async () => {
  vi.resetModules();
  renderWithClient(<PowerUnitForm />);
});

describe("All Power Unit Form Fields", () => {
  it("should render all form fields", async () => {
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

    clickSubmit();

    // Check for number of select dropdowns and the Cancel & Add To Inventory buttons
    const selectFields = await screen.findAllByRole("button");
    expect(selectFields).toHaveLength(5);
    // Check for number of input fields
    const inputFields = await screen.findAllByRole("textbox");
    expect(inputFields).toHaveLength(7);
  });
});

describe("Power Unit Form: Test VIN field validation", () => {
  it("should show error when submitting empty VIN field", async () => {
    clickSubmit();
    expect(await screen.findByTestId("alert-vin")).toBeInTheDocument();
  });

  it("should show error when submitting VIN with 5 characters", async () => {
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

  it("should NOT show error when submitting VIN with 6 characters", async () => {
    const vinTextField = screen.getByRole("textbox", {
      name: /vin/i,
    });

    await act(async () => {
      fireEvent.change(vinTextField, { target: { value: "123456" } });
    });

    expect(vinTextField).toHaveValue("123456");

    clickSubmit();

    expect(screen.queryByTestId("alert-vin")).toBeNull();
  });
});

// describe("Mocked Axios call for getting Power Unit Types", () => {
//   it("should return a list of power unit types", async () => {

//     // To Add at top of file
//     const mockedPowerUnitTypeData = [
//       {
//         typeCode: "CONCRET",
//         type: "Concrete Pumper Trucks",
//         description:
//           "Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.",
//       },
//     ];
//     const mockedAxiosGetResponse = {
//       data: mockedPowerUnitTypeData,
//     };
//     vi.mock("axios");
//     const mockedAxios = axios as jest.Mocked<typeof axios>;

//     mockedAxios.get.mockResolvedValueOnce(mockedAxiosGetResponse);
//     const result = await getPowerUnitTypes();
//     expect(axios.get).toHaveBeenCalledWith(VEHICLES_API.POWER_UNIT_TYPES);
//     expect(result).toEqual(mockedPowerUnitTypeData);
//   });
// });

describe("Power Unit Form Submission", () => {
  it("should return a list of power unit types", async () => {
    const subtype = screen.getByRole("button", {
      name: /powerUnitTypeCode/i,
    });

    fireEvent.mouseDown(subtype);

    const listbox = within(screen.getByRole("listbox"));

    fireEvent.click(listbox.getByText(/Concrete Pumper Trucks/i));

    expect(subtype).toHaveTextContent(/Concrete Pumper Trucks/i);
  });

  it("should successfully submit form without errors shown on ui", async () => {
    const unitNumber = getUnitNumber();
    const make = getMake();
    const year = getYear();
    const vin = getVIN();
    const plate = getPlate();
    const subtype = getVehicleSubType();
    const country = getCountry();
    const province = getProvince();
    const licensedGvw = getLicensedGvw();
    const steerAxleTireSize = getSteerAxleTireSize();

    await act(async () => {
      fireEvent.input(unitNumber, { target: { value: "Ken10" } });
      fireEvent.input(make, { target: { value: "Kenworth" } });
      fireEvent.input(year, { target: { value: "2020" } });
      fireEvent.input(vin, { target: { value: "123456" } });
      fireEvent.input(plate, { target: { value: "ABC123" } });
      fireEvent.input(licensedGvw, { target: { value: "85000" } });
      fireEvent.input(steerAxleTireSize, { target: { value: "300" } });

      // Vehicle Sub type
      const powerUnitTypeSelectMenu = screen.getByTestId(
        "select-powerUnitTypeCode"
      );
      fireEvent.change(powerUnitTypeSelectMenu, {
        target: { value: "CONCRET" },
      });

      // Country
      const countrySelectMenu = screen.getByTestId("select-country");
      fireEvent.change(countrySelectMenu, {
        target: { value: "CA" },
      });

      // Province
      const provinceSelectMenu = screen.getByTestId("select-province");
      fireEvent.change(provinceSelectMenu, {
        target: { value: "AB" },
      });

      clickSubmit();
    });

    // Still need to figure out how to test MUI Select dropdowns for Country/Province
    expect(unitNumber).toHaveValue("Ken10");
    expect(make).toHaveValue("Kenworth");
    expect(year).toHaveValue("2020");
    expect(vin).toHaveValue("123456");
    expect(plate).toHaveValue("ABC123");
    expect(subtype).toHaveTextContent(/Concrete Pumper Trucks/i);
    expect(country).toHaveTextContent(/Canada/i);
    expect(province).toHaveTextContent(/Alberta/i);
    expect(licensedGvw).toHaveValue("85000");
    expect(steerAxleTireSize).toHaveValue("300");

    // check that there are no errors shown after submission
    expect(screen.queryByTestId("alert", { exact: false })).toBeNull();
  });
});

// HELPERS
const clickSubmit = () => {
  user.click(screen.getByRole("button", { name: /Add To Inventory/i }));
};

// const sleep = (ms: number) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

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
