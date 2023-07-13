import { vi } from "vitest";
import {
  chooseOption,
  clickSubmit, 
  countrySelect, 
  emptyTrailerWidthInput, 
  makeInput, 
  numericInputs, 
  plateInput, 
  provinceSelect, 
  replaceValueForInput, 
  selectOptionsAndButtons, 
  submitErrorsDisplay, 
  textInputs, 
  trailerTypeCodeSelect, 
  unitNumberInput, 
  vinInput, 
  yearInput,
} from "./helpers/access";
import { closeMockServer, defaultTrailerSubtypes, listenToMockServer, renderTestTrailerForm, resetMockServer } from "./helpers/prepare";

beforeAll(() => {
  listenToMockServer();
});

beforeEach(async () => {
  vi.resetModules();
  resetMockServer();
});

afterAll(() => {
  closeMockServer();
});

describe("All Trailer Form Fields", () => {
  it("should render all form fields", async () => {
    // Arrange
    const { user } = renderTestTrailerForm();
    const unitNumber = await unitNumberInput();
    const make = await makeInput();
    const year = await yearInput();
    const vin = await vinInput();
    const plate = await plateInput();
    const subtype = await trailerTypeCodeSelect();
    const country = await countrySelect();
    const province = await provinceSelect();
    const emptyTrailerWidth = await emptyTrailerWidthInput();

    expect(unitNumber).toBeInTheDocument();
    expect(make).toBeInTheDocument();
    expect(year).toBeInTheDocument();
    expect(vin).toBeInTheDocument();
    expect(plate).toBeInTheDocument();
    expect(subtype).toBeInTheDocument();
    expect(country).toBeInTheDocument();
    expect(province).toBeInTheDocument();
    expect(emptyTrailerWidth).toBeInTheDocument();

    // Act
    await clickSubmit(user);

    // Assert
    // Check for number of select dropdowns and the Cancel & Add To Inventory buttons
    const selectFields = await selectOptionsAndButtons();
    expect(selectFields).toHaveLength(5);
    // Check for number of input fields
    const inputFields = await textInputs();
    expect(inputFields).toHaveLength(5);
    // Check for number of inputs with type="number" (ie. role of "spinbutton")
    const numberFields = await numericInputs();
    expect(numberFields).toHaveLength(1);
  });
});

describe("Trailer Form Submission", () => {
  it("should return a list of trailer types", async () => {
    // Arrange
    const { user } = renderTestTrailerForm();

    // Act
    const subtype = defaultTrailerSubtypes[0].type;
    const subtypeSelect = await trailerTypeCodeSelect();
    await chooseOption(user, subtypeSelect, subtype);

    // Assert
    expect(subtypeSelect).toHaveTextContent(subtype);
  });

  it("should successfully submit form without errors shown on ui", async () => {
    // Arrange
    const { user } = renderTestTrailerForm();
    const unitNumber = await unitNumberInput();
    const make = await makeInput();
    const year = await yearInput();
    const vin = await vinInput();
    const plate = await plateInput();
    const subtype = await trailerTypeCodeSelect();
    const country = await countrySelect();
    const province = await provinceSelect();

    // Act
    const newUnitNumber = "Ken10";
    const newMake = "Kenworth";
    const newYear = 2020;
    const newVin = "123456";
    const newPlate = "ABC123";
    const newSubtype = defaultTrailerSubtypes[0].type;
    const newCountry = "Canada";
    const newProvince = "Alberta";
    
    await replaceValueForInput(user, unitNumber, 0, newUnitNumber);
    await replaceValueForInput(user, make, 0, newMake);
    await replaceValueForInput(user, year, 1, `${newYear}`);
    await replaceValueForInput(user, vin, 0, newVin);
    await replaceValueForInput(user, plate, 0, newPlate);
    await chooseOption(user, subtype, newSubtype);
    await chooseOption(user, country, newCountry);
    await chooseOption(user, province, newProvince);
    await clickSubmit(user);

    // Assert
    expect(unitNumber).toHaveValue(newUnitNumber);
    expect(make).toHaveValue(newMake);
    expect(year).toHaveValue(newYear);
    expect(vin).toHaveValue(newVin);
    expect(plate).toHaveValue(newPlate);
    expect(subtype).toHaveTextContent(newSubtype);
    expect(country).toHaveTextContent(newCountry);
    expect(province).toHaveTextContent(newProvince);

    // Assert - no errors shown after submission
    expect(async () => await submitErrorsDisplay()).rejects.toThrow();
  });
});
