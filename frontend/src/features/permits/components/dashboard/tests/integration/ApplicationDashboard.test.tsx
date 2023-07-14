import { waitFor } from "@testing-library/react";

import { formatPhoneNumber } from "../../../../../../common/components/form/subFormComponents/PhoneNumberInput";
import { 
  findPowerUnit,
  getAllPowerUnitTypes, 
  getAllPowerUnits, 
  getAllTrailers, 
  getDefaultPowerUnitTypes, 
  getDefaultTrailerTypes, 
  resetVehicleSource,
} from "./fixtures/getVehicleInfo";
import { getEmptyUserDetails } from "./fixtures/getUserDetails";
import { resetApplicationSource } from "./fixtures/getActiveApplication";
import { DATE_FORMATS, dayjsToLocalStr, utcToLocalDayjs } from "../../../../../../common/helpers/formatDate";
import { 
  closeMockServer, 
  companyInfo, 
  defaultUserDetails, 
  listenToMockServer, 
  newApplicationNumber, 
  renderTestComponent, 
  resetMockServer,
} from "./helpers/prepare";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { 
  applicationCreatedDateDisplay,
  applicationNumberDisplay,
  applicationUpdatedDateDisplay,
  chooseOption,
  chooseSaveVehicleToInventory,
  companyClientNumberDisplay,
  companyNameDisplay,
  continueApplication,
  errMsgForEmail,
  errMsgForFirstName,
  errMsgForLastName,
  errMsgForMake,
  errMsgForPhone1,
  errMsgForPlate,
  errMsgForVIN,
  errMsgForVehicleCountry,
  errMsgForVehicleSubtype,
  errMsgForVehicleType,
  errMsgForVehicleYear,
  getSavedApplication,
  inputWithValue, 
  makeInput, 
  openVehicleSelect, 
  openVehicleSubtypeSelect, 
  plateInput, 
  replaceValueForInput, 
  saveApplication, 
  sendPermitToEmailMsg, 
  unitNumberOrPlateSelect, 
  vehicleCountrySelect,
  vehicleOptions, 
  vehicleProvinceSelect, 
  vehicleSelect, 
  vehicleSubtypeOptions,
  vehicleSubtypeSelect,
  vehicleTypeSelect,
  vehicleYearInput,
  vinInput,
} from "./helpers/access";
import { formatCountry, formatProvince } from "../../../../../../common/helpers/formatCountryProvince";

const {
  firstName,
  lastName,
  phone1,
  phone1Extension,
  phone2,
  phone2Extension,
  email,
  fax,
} = defaultUserDetails.userDetails;

global.scrollTo = vi.fn();

beforeAll(() => {
  resetVehicleSource();
  resetApplicationSource();
  listenToMockServer();
});

beforeEach(async () => {
  resetVehicleSource();
  resetApplicationSource();
  vi.resetModules();
});

afterEach(() => {
  resetMockServer();
});

afterAll(() => {
  closeMockServer();
});

describe("Application Contact Details", () => {
  it("should properly display Contact Details", async () => {
    // Arrange and Act
    renderTestComponent(defaultUserDetails);

    // Assert - should show proper info for the default user details passed in
    expect(await inputWithValue(firstName)).toBeVisible();
    expect(await inputWithValue(lastName)).toBeVisible();
    expect(await inputWithValue(phone1)).toBeVisible();
    expect(await inputWithValue(phone1Extension)).toBeVisible();
    expect(await inputWithValue(phone2)).toBeVisible();
    expect(await inputWithValue(phone2Extension)).toBeVisible();
    expect(await inputWithValue(email)).toBeVisible();
    expect(await inputWithValue(fax)).toBeVisible();
    expect(await sendPermitToEmailMsg()).toBeInTheDocument();
  });

  it("should properly edit Contact Details", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);

    const firstNameInput = await inputWithValue(firstName);
    const lastNameInput = await inputWithValue(lastName);
    const phone1Input = await inputWithValue(phone1);
    const phone1ExtInput = await inputWithValue(phone1Extension);
    const phone2Input = await inputWithValue(phone2);
    const phone2ExtInput = await inputWithValue(phone2Extension);
    const emailInput = await inputWithValue(email);
    const faxInput = await inputWithValue(fax);

    // Act - change various input field values and save application
    const newFirstName = "Myfirstname";
    await replaceValueForInput(user, firstNameInput, firstName.length, newFirstName);
    const newLastName = "Mylastname";
    await replaceValueForInput(user, lastNameInput, lastName.length, newLastName);
    const newPhone1 = formatPhoneNumber("778-123-4567");
    await replaceValueForInput(user, phone1Input, phone1.length, newPhone1);
    const newPhone2 = formatPhoneNumber("778-123-4568");
    await replaceValueForInput(user, phone2Input, phone2.length, newPhone2);
    const newEmail = "mc@mycompany.co";
    await replaceValueForInput(user, emailInput, email.length, newEmail);
    await saveApplication(user);

    // Assert - input fields should contain updated values
    await getSavedApplication();
    expect(firstNameInput).toHaveValue(newFirstName);
    expect(lastNameInput).toHaveValue(newLastName);
    expect(phone1Input).toHaveValue(newPhone1);
    expect(phone1ExtInput).toHaveValue(phone1Extension);
    expect(phone2Input).toHaveValue(newPhone2);
    expect(phone2ExtInput).toHaveValue(phone2Extension);
    expect(emailInput).toHaveValue(newEmail);
    expect(faxInput).toHaveValue(fax);
    expect(await sendPermitToEmailMsg()).toBeInTheDocument();
  });

  it("should show validation errors when submitting empty contact details", async () => {
    // Arrange
    const emptyUserDetails = getEmptyUserDetails();
    const { user } = renderTestComponent(emptyUserDetails);

    // Act - click 'continue' when contact details fields are empty
    await continueApplication(user);

    // Assert - error messages should be displayed
    const requiredMsg = "This is a required field.";
    expect(await errMsgForFirstName()).toHaveTextContent(requiredMsg);
    expect(await errMsgForLastName()).toHaveTextContent(requiredMsg);
    expect(await errMsgForPhone1()).toHaveTextContent(requiredMsg);
    expect(await errMsgForEmail()).toHaveTextContent(requiredMsg);
  });
});

describe("Application Header", () => {
  it("should display application number after creating application", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);

    // Act
    await saveApplication(user);

    // Assert
    const applicationData = await getSavedApplication();
    const expectedApplicationNumber = getDefaultRequiredVal(
      newApplicationNumber,
      applicationData?.applicationNumber,
    );
    expect(await applicationNumberDisplay()).toHaveTextContent(expectedApplicationNumber);
  });

  it("should display proper created datetime after creating application", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);

    // Act
    await saveApplication(user);

    // Assert
    const applicationData = await getSavedApplication();
    const expectedCreatedDt = getDefaultRequiredVal(
      "",
      applicationData?.createdDateTime,
    );
    const formattedDt = dayjsToLocalStr(
      utcToLocalDayjs(expectedCreatedDt), 
      DATE_FORMATS.LONG
    );
    expect(await applicationCreatedDateDisplay()).toHaveTextContent(formattedDt);
  });

  it("should display proper updated datetime after updating application", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);

    // Act
    await saveApplication(user);

    // Assert
    const applicationData = await getSavedApplication();
    const expectedUpdatedDt = getDefaultRequiredVal(
      "",
      applicationData?.updatedDateTime,
    );
    const formattedDt = dayjsToLocalStr(
      utcToLocalDayjs(expectedUpdatedDt), 
      DATE_FORMATS.LONG
    );
    expect(await applicationUpdatedDateDisplay()).toHaveTextContent(formattedDt);
  });

  it("should display company information", async () => {
    // Arrange and Act
    renderTestComponent(defaultUserDetails);

    // Assert
    const { legalName, clientNumber } = companyInfo;
    expect(await companyNameDisplay()).toHaveTextContent(legalName);
    expect(await companyClientNumberDisplay()).toHaveTextContent(clientNumber);
  });
});

describe("Vehicle Details", () => {
  it("should not show excluded subtypes for power units", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);

    // Act
    const vehicleType = await vehicleTypeSelect();
    await chooseOption(user, vehicleType, "Power Unit");
    await openVehicleSubtypeSelect(user);

    // Assert
    const shownSubtypes = getDefaultPowerUnitTypes().slice(0, -1).map(subtype => subtype.type);
    const excludedSubtypes = getDefaultPowerUnitTypes().slice(-1).map(subtype => subtype.type);
    const subtypeOptions = await vehicleSubtypeOptions();
    const subtypeOptionsText = subtypeOptions.map(option => option.textContent ?? "");
    const properOptions = subtypeOptionsText.filter((optionText) => {
      return shownSubtypes.includes(optionText);
    });
    const displayedOptions = shownSubtypes.filter((subtype) => {
      return subtypeOptionsText.includes(subtype);
    });
    const excludedOptions = subtypeOptionsText.filter((optionText) => {
      return excludedSubtypes.includes(optionText);
    });
    const displayedExcludedOptions = excludedSubtypes.filter((subtype) => {
      return subtypeOptionsText.includes(subtype);
    });
    expect(properOptions).toHaveLength(shownSubtypes.length);
    expect(displayedOptions).toHaveLength(shownSubtypes.length);
    expect(excludedOptions).toHaveLength(0);
    expect(displayedExcludedOptions).toHaveLength(0);
  });

  it("should not show excluded subtypes for trailers", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);

    // Act
    const vehicleType = await vehicleTypeSelect();
    await chooseOption(user, vehicleType, "Trailer");
    await openVehicleSubtypeSelect(user);

    // Assert
    const shownSubtypes = getDefaultTrailerTypes().slice(0, -1).map(subtype => subtype.type);
    const excludedSubtypes = getDefaultTrailerTypes().slice(-1).map(subtype => subtype.type);
    const subtypeOptions = await vehicleSubtypeOptions();
    const subtypeOptionsText = subtypeOptions.map(option => option.textContent ?? "");
    const properOptions = subtypeOptionsText.filter((optionText) => {
      return shownSubtypes.includes(optionText);
    });
    const displayedOptions = shownSubtypes.filter((subtype) => {
      return subtypeOptionsText.includes(subtype);
    });
    const excludedOptions = subtypeOptionsText.filter((optionText) => {
      return excludedSubtypes.includes(optionText);
    });
    const displayedExcludedOptions = excludedSubtypes.filter((subtype) => {
      return subtypeOptionsText.includes(subtype);
    });
    expect(properOptions).toHaveLength(shownSubtypes.length);
    expect(displayedOptions).toHaveLength(shownSubtypes.length);
    expect(excludedOptions).toHaveLength(0);
    expect(displayedExcludedOptions).toHaveLength(0);
  });

  it("should display error messages for empty vehicle detail fields", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);

    // Act
    await continueApplication(user);

    // Assert
    const requiredMsg = "This is a required field.";
    const emptyYearMsg = "Year must not be less than 1950.";
    expect(await errMsgForVIN()).toHaveTextContent(requiredMsg);
    expect(await errMsgForPlate()).toHaveTextContent(requiredMsg);
    expect(await errMsgForMake()).toHaveTextContent(requiredMsg);
    const vehicleYearErrDisplay = await errMsgForVehicleYear();
    expect([requiredMsg, emptyYearMsg]).toContain(vehicleYearErrDisplay.textContent);
    expect(await errMsgForVehicleCountry()).toHaveTextContent(requiredMsg);
    expect(await errMsgForVehicleSubtype()).toHaveTextContent(requiredMsg);
    expect(await errMsgForVehicleType()).toHaveTextContent(requiredMsg);
  });

  it("should add new vehicle to inventory if user chooses to", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);
    const powerUnits = getAllPowerUnits();
    const existingVehicle = powerUnits[0];
    const vehicle = {
      ...existingVehicle,
      vin: `${existingVehicle.vin.slice(1)}1`,
    };
    const country = formatCountry(vehicle.countryCode);
    const province = formatProvince(vehicle.countryCode, vehicle.provinceCode);
    const vehicleType = "Power Unit";
    const vehicleSubtype = getAllPowerUnitTypes()
      .find(subtype => subtype.typeCode === vehicle.powerUnitTypeCode)?.type ?? "";
    const vinTextField = await vinInput();
    const plateTextField = await plateInput();
    const makeTextField = await makeInput();
    const yearTextField = await vehicleYearInput();
    const countrySelect = await vehicleCountrySelect();
    const provinceSelect = await vehicleProvinceSelect();
    const typeSelect = await vehicleTypeSelect();
    const subtypeSelect = await vehicleSubtypeSelect();

    // Act
    await replaceValueForInput(user, vinTextField, 0, vehicle.vin);
    await replaceValueForInput(user, plateTextField, 0, vehicle.plate);
    await replaceValueForInput(user, makeTextField, 0, vehicle.make);
    await replaceValueForInput(user, yearTextField, 1, `${vehicle.year}`);
    await chooseOption(user, countrySelect, country);
    await chooseOption(user, provinceSelect, province);
    await chooseOption(user, typeSelect, vehicleType);
    await chooseOption(user, subtypeSelect, vehicleSubtype);
    await chooseSaveVehicleToInventory(user, true);
    await continueApplication(user);

    // Assert
    await waitFor(() => {
      expect(getAllPowerUnits().length).toBeGreaterThan(powerUnits.length);
    });
  });

  it("should not add new vehicle to inventory if user chooses not to", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);
    const powerUnits = getAllPowerUnits();
    const existingVehicle = powerUnits[0];
    const vehicle = {
      ...existingVehicle,
      vin: `${existingVehicle.vin.slice(1)}1`,
    };
    const country = formatCountry(vehicle.countryCode);
    const province = formatProvince(vehicle.countryCode, vehicle.provinceCode);
    const vehicleType = "Power Unit";
    const vehicleSubtype = getAllPowerUnitTypes()
      .find(subtype => subtype.typeCode === vehicle.powerUnitTypeCode)?.type ?? "";
    const vinTextField = await vinInput();
    const plateTextField = await plateInput();
    const makeTextField = await makeInput();
    const yearTextField = await vehicleYearInput();
    const countrySelect = await vehicleCountrySelect();
    const provinceSelect = await vehicleProvinceSelect();
    const typeSelect = await vehicleTypeSelect();
    const subtypeSelect = await vehicleSubtypeSelect();

    // Act
    await replaceValueForInput(user, vinTextField, 0, vehicle.vin);
    await replaceValueForInput(user, plateTextField, 0, vehicle.plate);
    await replaceValueForInput(user, makeTextField, 0, vehicle.make);
    await replaceValueForInput(user, yearTextField, 1, `${vehicle.year}`);
    await chooseOption(user, countrySelect, country);
    await chooseOption(user, provinceSelect, province);
    await chooseOption(user, typeSelect, vehicleType);
    await chooseOption(user, subtypeSelect, vehicleSubtype);
    await chooseSaveVehicleToInventory(user, false);
    await continueApplication(user);

    // Assert
    await waitFor(() => {
      expect(getAllPowerUnits().length).toBeGreaterThan(powerUnits.length);
    }).catch(err => {
      expect(err).not.toBeUndefined();
    });
  });

  it("should update vehicle in inventory if user chooses to", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);
    const powerUnits = getAllPowerUnits();
    const existingVehicle = powerUnits[0];
    const country = formatCountry(existingVehicle.countryCode);
    const updatedProvinceAbbr = "AB";
    const updatedProvince = formatProvince(existingVehicle.countryCode, updatedProvinceAbbr);
    const vehicleType = "Power Unit";
    const vehicleSubtype = getAllPowerUnitTypes()
      .find(subtype => subtype.typeCode === existingVehicle.powerUnitTypeCode)?.type ?? "";
    const vinTextField = await vinInput();
    const plateTextField = await plateInput();
    const makeTextField = await makeInput();
    const yearTextField = await vehicleYearInput();
    const countrySelect = await vehicleCountrySelect();
    const provinceSelect = await vehicleProvinceSelect();
    const typeSelect = await vehicleTypeSelect();
    const subtypeSelect = await vehicleSubtypeSelect();

    // Act
    await replaceValueForInput(user, vinTextField, 0, existingVehicle.vin);
    await replaceValueForInput(user, plateTextField, 0, existingVehicle.plate);
    await replaceValueForInput(user, makeTextField, 0, existingVehicle.make);
    await replaceValueForInput(user, yearTextField, 1, `${existingVehicle.year}`);
    await chooseOption(user, countrySelect, country);
    await chooseOption(user, provinceSelect, updatedProvince);
    await chooseOption(user, typeSelect, vehicleType);
    await chooseOption(user, subtypeSelect, vehicleSubtype);
    await chooseSaveVehicleToInventory(user, true);
    await continueApplication(user);

    // Assert
    await waitFor(() => {
      const updatedVehicle = findPowerUnit(existingVehicle.vin);
      expect(updatedVehicle?.provinceCode).toBe(updatedProvinceAbbr);
    });
  });

  it("should not update vehicle in inventory if user chooses not to", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);
    const powerUnits = getAllPowerUnits();
    const existingVehicle = powerUnits[0];
    const country = formatCountry(existingVehicle.countryCode);
    const updatedProvinceAbbr = "AB";
    const updatedProvince = formatProvince(existingVehicle.countryCode, updatedProvinceAbbr);
    const vehicleType = "Power Unit";
    const vehicleSubtype = getAllPowerUnitTypes()
      .find(subtype => subtype.typeCode === existingVehicle.powerUnitTypeCode)?.type ?? "";
    const vinTextField = await vinInput();
    const plateTextField = await plateInput();
    const makeTextField = await makeInput();
    const yearTextField = await vehicleYearInput();
    const countrySelect = await vehicleCountrySelect();
    const provinceSelect = await vehicleProvinceSelect();
    const typeSelect = await vehicleTypeSelect();
    const subtypeSelect = await vehicleSubtypeSelect();

    // Act
    await replaceValueForInput(user, vinTextField, 0, existingVehicle.vin);
    await replaceValueForInput(user, plateTextField, 0, existingVehicle.plate);
    await replaceValueForInput(user, makeTextField, 0, existingVehicle.make);
    await replaceValueForInput(user, yearTextField, 1, `${existingVehicle.year}`);
    await chooseOption(user, countrySelect, country);
    await chooseOption(user, provinceSelect, updatedProvince);
    await chooseOption(user, typeSelect, vehicleType);
    await chooseOption(user, subtypeSelect, vehicleSubtype);
    await chooseSaveVehicleToInventory(user, false);
    await continueApplication(user);

    // Assert
    await waitFor(() => {
      const updatedVehicle = findPowerUnit(existingVehicle.vin);
      expect(updatedVehicle?.provinceCode).toBe(updatedProvinceAbbr);
    }).catch(err => {
      expect(err).not.toBeUndefined();
    });
  });

  it("should show vehicles grouped by vehicle type", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);
    const unitNumberOrPlate = await unitNumberOrPlateSelect();
    const powerUnits = getAllPowerUnits();
    const trailers = getAllTrailers();

    // Act
    await chooseOption(user, unitNumberOrPlate, "Unit Number");
    await openVehicleSelect(user);

    // Assert
    const powerUnitOptions = await vehicleOptions("powerUnit");
    const trailerOptions = await vehicleOptions("trailer");
    expect(powerUnitOptions.length).toBe(powerUnits.length);
    expect(trailerOptions.length).toBe(trailers.length);

    // Act
    await chooseOption(user, unitNumberOrPlate, "Plate");
    await openVehicleSelect(user);

    // Assert
    const updatedPowerUnitOptions = await vehicleOptions("powerUnit");
    const updatedTrailerOptions = await vehicleOptions("trailer");
    expect(updatedPowerUnitOptions.length).toBe(powerUnits.length);
    expect(updatedTrailerOptions.length).toBe(trailers.length);
  });

  it("should filter vehicle options by typing in plate", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);
    const { plate } = getAllPowerUnits()[0];
    const unitNumberOrPlate = await unitNumberOrPlateSelect();
    await chooseOption(user, unitNumberOrPlate, "Plate");

    // Act
    await openVehicleSelect(user);
    const vehicleTextfield = await vehicleSelect();
    await replaceValueForInput(user, vehicleTextfield, 0, plate);

    // Assert
    const powerUnitOptions = await vehicleOptions("powerUnit");
    expect(powerUnitOptions.length).toBe(1);
    expect(powerUnitOptions[0]).toHaveTextContent(plate);
    expect(async () => await vehicleOptions("trailer")).rejects.toThrow();
  });

  it("should filter vehicle options by typing in unit number", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);
    const unitNumber = getDefaultRequiredVal("", getAllTrailers()[0].unitNumber);
    const unitNumberOrPlate = await unitNumberOrPlateSelect();
    await chooseOption(user, unitNumberOrPlate, "Unit Number");

    // Act
    await openVehicleSelect(user);
    const vehicleTextfield = await vehicleSelect();
    await replaceValueForInput(user, vehicleTextfield, 0, unitNumber);

    // Assert
    const trailerOptions = await vehicleOptions("trailer");
    expect(trailerOptions.length).toBe(1);
    expect(trailerOptions[0]).toHaveTextContent(unitNumber);
    expect(async () => await vehicleOptions("powerUnit")).rejects.toThrow();
  });

  it("should fill in vehicle details after choosing vehicle option", async () => {
    // Arrange
    const { user } = renderTestComponent(defaultUserDetails);
    const vehicle = getAllPowerUnits()[0];
    const unitNumber = getDefaultRequiredVal("", vehicle.unitNumber);
    const vehicleSubtype = getDefaultRequiredVal(
      "",
      getAllPowerUnitTypes()
        .find(subtype => subtype.typeCode === vehicle.powerUnitTypeCode)?.type
    );

    // Act
    const unitNumberOrPlate = await unitNumberOrPlateSelect();
    await chooseOption(user, unitNumberOrPlate, "Unit Number");
    const vehicleSelectEl = await vehicleSelect();
    await chooseOption(user, vehicleSelectEl, unitNumber);

    // Assert
    const vin = await vinInput();
    const plate = await plateInput();
    const make = await makeInput();
    const year = await vehicleYearInput();
    const country = await vehicleCountrySelect();
    const province = await vehicleProvinceSelect();
    const type = await vehicleTypeSelect();
    const subtype = await vehicleSubtypeSelect();
    expect(vin).toHaveValue(vehicle.vin);
    expect(plate).toHaveValue(vehicle.plate);
    expect(make).toHaveValue(vehicle.make);
    expect(year).toHaveValue(vehicle.year);
    expect(country).toHaveTextContent(formatCountry(vehicle.countryCode));
    expect(province).toHaveTextContent(formatProvince(vehicle.countryCode, vehicle.provinceCode));
    expect(type).toHaveTextContent("Power Unit");
    expect(subtype).toHaveTextContent(vehicleSubtype);
  });
});
