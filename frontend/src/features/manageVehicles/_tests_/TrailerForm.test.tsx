import { act, fireEvent, screen, within } from "@testing-library/react";
import { vi } from "vitest";
import { TrailerForm } from "../components/form/TrailerForm";
import {
  clickSubmit,
  getCountry,
  getEmptyTrailerWidth,
  getMake,
  getPlate,
  getProvince,
  getUnitNumber,
  getTrailerTypeCode,
  getVIN,
  getYear,
  renderWithClient,
} from "./utils";

beforeEach(async () => {
  vi.resetModules();

  // Temp solution for mocking React Query to test the gettrailerTypes API call
  vi.mock("@tanstack/react-query", async () => {
    const actual: any = await vi.importActual("@tanstack/react-query");
    return {
      ...actual,
      useQuery: vi.fn().mockReturnValue({
        data: [
          {
            typeCode: "BOOSTER",
            type: "Boosters",
            description:
              "A Booster is similar to a jeep, but it is used behind a load.",
          },
        ],
        isLoading: false,
        error: {},
      }),
    };
  });

  renderWithClient(<TrailerForm />);
});

describe("All Trailer Form Fields", () => {
  it("should render all form fields", async () => {
    const unitNumber = getUnitNumber();
    const make = getMake();
    const year = getYear();
    const vin = getVIN();
    const plate = getPlate();
    const subtype = getTrailerTypeCode();
    const country = getCountry();
    const province = getProvince();
    const emptyTrailerWidth = getEmptyTrailerWidth();

    expect(unitNumber).toBeInTheDocument();
    expect(make).toBeInTheDocument();
    expect(year).toBeInTheDocument();
    expect(vin).toBeInTheDocument();
    expect(plate).toBeInTheDocument();
    expect(subtype).toBeInTheDocument();
    expect(country).toBeInTheDocument();
    expect(province).toBeInTheDocument();
    expect(emptyTrailerWidth).toBeInTheDocument();

    clickSubmit();

    // Check for number of select dropdowns and the Cancel & Add To Inventory buttons
    const selectFields = await screen.findAllByRole("button");
    expect(selectFields).toHaveLength(5);
    // Check for number of input fields
    const inputFields = await screen.findAllByRole("textbox");
    expect(inputFields).toHaveLength(5);
    // Check for number of inputs with type="number" (ie. role of "spinbutton")
    const numberFields = await screen.findAllByRole("spinbutton");
    expect(numberFields).toHaveLength(1);
  });
});

describe("Trailer Form Submission", () => {
  it("should return a list of trailer types", async () => {
    const subtype = screen.getByRole("button", {
      name: /trailerTypeCode/i,
    });

    fireEvent.mouseDown(subtype);

    const listbox = within(screen.getByRole("listbox"));

    fireEvent.click(listbox.getByText(/Boosters/i));

    expect(subtype).toHaveTextContent(/Boosters/i);
  });

  it("should successfully submit form without errors shown on ui", async () => {
    const unitNumber = getUnitNumber();
    const make = getMake();
    const year = getYear();
    const vin = getVIN();
    const plate = getPlate();
    const subtype = getTrailerTypeCode();
    const country = getCountry();
    const province = getProvince();

    await act(async () => {
      fireEvent.input(unitNumber, { target: { value: "Ken10" } });
      fireEvent.input(make, { target: { value: "Kenworth" } });
      fireEvent.input(year, { target: { value: "2020" } });
      fireEvent.input(vin, { target: { value: "123456" } });
      fireEvent.input(plate, { target: { value: "ABC123" } });

      // Vehicle Sub type
      const trailerTypeSelectMenu = screen.getByTestId(
        "select-trailerTypeCode"
      );
      fireEvent.change(trailerTypeSelectMenu, {
        target: { value: "BOOSTER" },
      });

      // Country
      const countrySelectMenu = screen.getByTestId("select-countryCode");
      fireEvent.change(countrySelectMenu, {
        target: { value: "CA" },
      });

      // Province
      const provinceSelectMenu = screen.getByTestId("select-provinceCode");
      fireEvent.change(provinceSelectMenu, {
        target: { value: "AB" },
      });

      clickSubmit();
    });

    // Still need to figure out how to test MUI Select dropdowns for Country/Province
    expect(unitNumber).toHaveValue("Ken10");
    expect(make).toHaveValue("Kenworth");
    expect(year).toHaveValue(2020);
    expect(vin).toHaveValue("123456");
    expect(plate).toHaveValue("ABC123");
    expect(subtype).toHaveTextContent(/Boosters/i);
    expect(country).toHaveTextContent(/Canada/i);
    expect(province).toHaveTextContent(/Alberta/i);

    // check that there are no errors shown after submission
    expect(screen.queryByTestId("alert", { exact: false })).toBeNull();
  });
});
