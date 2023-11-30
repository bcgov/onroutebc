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
  selectOptionsAndButtons,
  submitVehicleForm,
  textInputs,
  trailerTypeCodeSelect,
  unitNumberInput,
  vinInput,
  yearInput,
} from "./helpers/access";
import {
  closeMockServer,
  defaultTrailerSubtypes,
  listenToMockServer,
  renderTestTrailerForm,
  resetMockServer,
  trailerDetails,
} from "./helpers/prepare";
import { assertSuccessfulSubmit } from "./helpers/assert";

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

// describe("All Trailer Form Fields", () => {
//   it("should render all form fields", async () => {
//     // Arrange
//     const { user } = renderTestTrailerForm();
//     const unitNumber = await unitNumberInput();
//     const make = await makeInput();
//     const year = await yearInput();
//     const vin = await vinInput();
//     const plate = await plateInput();
//     const subtype = await trailerTypeCodeSelect();
//     const country = await countrySelect();
//     const province = await provinceSelect();
//     const emptyTrailerWidth = await emptyTrailerWidthInput();

//     expect(unitNumber).toBeInTheDocument();
//     expect(make).toBeInTheDocument();
//     expect(year).toBeInTheDocument();
//     expect(vin).toBeInTheDocument();
//     expect(plate).toBeInTheDocument();
//     expect(subtype).toBeInTheDocument();
//     expect(country).toBeInTheDocument();
//     expect(province).toBeInTheDocument();
//     expect(emptyTrailerWidth).toBeInTheDocument();

//     // Act
//     await clickSubmit(user);

//     // Assert
//     // Check for number of select dropdowns and the Cancel & Add To Inventory buttons
//     const selectFields = await selectOptionsAndButtons();
//     expect(selectFields).toHaveLength(5);
//     // Check for number of input fields
//     const inputFields = await textInputs();
//     expect(inputFields).toHaveLength(5);
//     // Check for number of inputs with type="number" (ie. role of "spinbutton")
//     const numberFields = await numericInputs();
//     expect(numberFields).toHaveLength(1);
//   });
// });

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

    // Act
    await submitVehicleForm(user, "trailer", trailerDetails);

    // Assert
    await assertSuccessfulSubmit("trailer", trailerDetails);
  });
});
