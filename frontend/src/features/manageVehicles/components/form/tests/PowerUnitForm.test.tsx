import { vi } from "vitest";
import {
  chooseOption,
  clickSubmit, 
  countrySelect, 
  licensedGvwInput, 
  makeInput, 
  numericInputs, 
  plateInput, 
  powerUnitTypeCodeSelect, 
  provinceSelect, 
  replaceValueForInput, 
  selectOptionsAndButtons, 
  steerAxleTireSizeInput, 
  submitErrorsDisplay, 
  textInputs, 
  unitNumberInput, 
  vinErrorDisplay, 
  vinInput, 
  yearInput,
} from "./helpers/access";

import { 
  closeMockServer, 
  defaultPowerUnitSubtypes, 
  listenToMockServer, 
  renderTestPowerUnitForm, 
  resetMockServer,
} from "./helpers/prepare";

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

describe("All Power Unit Form Fields", () => {
  it("should render all form fields", async () => {
    // Arrange and Act
    const { user } = renderTestPowerUnitForm();
    const unitNumber = await unitNumberInput();
    const make = await makeInput();
    const year = await yearInput();
    const vin = await vinInput();
    const plate = await plateInput();
    const powerUnitTypeCode = await powerUnitTypeCodeSelect();
    const country = await countrySelect();
    const province = await provinceSelect();
    const licensedGvw = await licensedGvwInput();
    const steerAxleTireSize = await steerAxleTireSizeInput();

    // Assert
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

    await clickSubmit(user);

    // Check for number of select dropdowns and the Cancel & Add To Inventory buttons
    const selectFields = await selectOptionsAndButtons();
    expect(selectFields).toHaveLength(5);
    // Check for number of input fields
    const inputFields = await textInputs();
    expect(inputFields).toHaveLength(5);
    // Check for number of inputs with type="number" (ie. role of "spinbutton")
    const numberFields = await numericInputs();
    expect(numberFields).toHaveLength(2);
  });
});

describe("Power Unit Form: Test VIN field validation", () => {
  it("should show error when submitting empty VIN field", async () => {
    // Arrange
    const { user } = renderTestPowerUnitForm();

    // Act
    await clickSubmit(user);

    // Assert
    expect(await vinErrorDisplay()).toBeInTheDocument();
  });

  it("should show error when submitting VIN with 5 characters", async () => {
    // Arrange
    const { user } = renderTestPowerUnitForm();
    const vinTextField = await vinInput();

    // Act
    const newVin = "12345";
    await replaceValueForInput(user, vinTextField, 0, newVin);
    expect(vinTextField).toHaveValue(newVin);
    await clickSubmit(user);

    // Assert
    expect(await vinErrorDisplay()).toHaveTextContent("Length must be 6");
  });

  it("should NOT show error when submitting VIN with 6 characters", async () => {
    // Arrange
    const { user } = renderTestPowerUnitForm();
    const vinTextField = await vinInput();

    // Act
    const newVin = "123456";
    await replaceValueForInput(user, vinTextField, 0, newVin);
    expect(vinTextField).toHaveValue(newVin);
    await clickSubmit(user);

    // Assert
    expect(async () => await vinErrorDisplay()).rejects.toThrow();
  });
});

describe("Power Unit Form Submission", () => {
  it("should return a list of power unit types", async () => {
    // Arrange
    const { user } = renderTestPowerUnitForm();

    // Act
    const subtype = defaultPowerUnitSubtypes[0].type;
    const subtypeSelect = await powerUnitTypeCodeSelect();
    await chooseOption(user, subtypeSelect, subtype);

    // Assert
    expect(subtypeSelect).toHaveTextContent(subtype);
  });

  it("should successfully submit form without errors shown on ui", async () => {
    // Arrange
    const { user } = renderTestPowerUnitForm();
    const unitNumber = await unitNumberInput();
    const make = await makeInput();
    const year = await yearInput();
    const vin = await vinInput();
    const plate = await plateInput();
    const subtype = await powerUnitTypeCodeSelect();
    const country = await countrySelect();
    const province = await provinceSelect();
    const licensedGvw = await licensedGvwInput();
    const steerAxleTireSize = await steerAxleTireSizeInput();

    // Act
    const newUnitNumber = "Ken10";
    const newMake = "Kenworth";
    const newYear = 2020;
    const newVin = "123456";
    const newPlate = "ABC123";
    const newGvw = 85000;
    const newTireSize = "300";
    const newSubtype = defaultPowerUnitSubtypes[0].type;
    const newCountry = "Canada";
    const newProvince = "Alberta";

    await replaceValueForInput(user, unitNumber, 0, newUnitNumber);
    await replaceValueForInput(user, make, 0, newMake);
    await replaceValueForInput(user, year, 1, `${newYear}`);
    await replaceValueForInput(user, vin, 0, newVin);
    await replaceValueForInput(user, plate, 0, newPlate);
    await replaceValueForInput(user, licensedGvw, 1, `${newGvw}`);
    await replaceValueForInput(user, steerAxleTireSize, 0, newTireSize);
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
    expect(licensedGvw).toHaveValue(newGvw);
    expect(steerAxleTireSize).toHaveValue(newTireSize);

    // Assert - no errors shown after submission
    expect(async () => await submitErrorsDisplay()).rejects.toThrow();
  });
});
