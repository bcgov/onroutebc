import { setupServer } from "msw/node";
import { rest } from "msw";

import { formatPhoneNumber } from "../../../../../../common/components/form/subFormComponents/PhoneNumberInput";
import { 
  createPowerUnit,
  createTrailer,
  getAllPowerUnitTypes, 
  getAllPowerUnits, 
  getAllTrailerTypes, 
  getAllTrailers,
  resetVehicleSource,
  updatePowerUnit,
} from "./fixtures/getVehicleInfo";
import { PERMITS_API } from "../../../../apiManager/endpoints/endpoints";
import { VEHICLES_API, VEHICLE_URL } from "../../../../../manageVehicles/apiManager/endpoints/endpoints";
import { getDefaultUserDetails, getEmptyUserDetails } from "./fixtures/getUserDetails";
import { getDefaultCompanyInfo } from "./fixtures/getCompanyInfo";
import { createApplication, getApplication, resetApplicationSource, updateApplication } from "./fixtures/getActiveApplication";
import { DATE_FORMATS, dayjsToLocalStr, dayjsToUtcStr, now, utcToLocalDayjs } from "../../../../../../common/helpers/formatDate";
import { renderTestComponent } from "./helpers/prepare";
import { 
  applicationCreatedDateDisplay,
  applicationNumberDisplay,
  applicationUpdatedDateDisplay,
  companyClientNumberDisplay,
  companyNameDisplay,
  continueApplication,
  errMsgForEmail,
  errMsgForFirstName,
  errMsgForLastName,
  errMsgForPhone1,
  getSavedApplication,
  inputWithValue, replaceValueForInput, saveApplication, sendPermitToEmailMsg,
} from "./helpers/access";
import { MANAGE_PROFILE_API } from "../../../../../manageProfile/apiManager/endpoints/endpoints";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";

// Use some default user details values to give to the OnRouteBCContext context provider
const defaultUserDetails = getDefaultUserDetails();
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

const newApplicationNumber = "A1-00000001-800-R01";
const companyInfo = getDefaultCompanyInfo();

// Mock API endpoints
const server = setupServer(
  // Mock creating/saving application
  rest.post(PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT, async (req, res, ctx) => {
    const reqBody = await req.json();
    const applicationData = { 
      ...reqBody,
      applicationNumber: newApplicationNumber,
      createdDateTime: dayjsToUtcStr(now()),
      updatedDateTime: dayjsToUtcStr(now()),
    };
    const createdApplication = createApplication(applicationData); // add to mock application store
    return res(ctx.status(201), ctx.json({
      ...createdApplication,
    }));
  }),
  // Mock updating/saving application
  rest.put(`${PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT}/:id`, async (req, res, ctx) => {
    const id = String(req.params.id);
    const reqBody = await req.json();
    const applicationData = {
      ...reqBody,
      updatedDateTime: dayjsToUtcStr(now()),
    }
    const updatedApplication = updateApplication(applicationData, id); // update application in mock application store

    if (!updatedApplication) {
      return res(ctx.status(404), ctx.json({
        message: "Application not found",
      }));
    }
    return res(ctx.json({
      ...updatedApplication,
    }));
  }),
  // Mock getting application
  rest.get(`${VEHICLE_URL}/permits/applications/:permitId`, (_, res, ctx) => {
    return res(ctx.json({
      // get application from mock application store (there's only 1 application or empty), since we're testing save/create/edit behaviour
      data: getApplication(), 
    }));
  }),
  // Mock getting power unit types
  rest.get(VEHICLES_API.POWER_UNIT_TYPES, async (_, res, ctx) => {
    return res(ctx.json({
      data: getAllPowerUnitTypes() // get power unit types from mock vehicle store
    
    }));
  }),
  // Mock getting trailer types
  rest.get(VEHICLES_API.TRAILER_TYPES, async (_, res, ctx) => {
    return res(ctx.json({
      data: getAllTrailerTypes() // get trailer types from mock vehicle store
    }));
  }),
  // Mock getting power unit vehicles
  rest.get(`${VEHICLE_URL}/companies/:companyId/vehicles/powerUnits`, async (_, res, ctx) => {
    return res(ctx.json({
      data: getAllPowerUnits(), // get power unit vehicles from mock vehicle store
    }));
  }),
  // Mock getting trailer vehicles
  rest.get(`${VEHICLE_URL}/companies/:companyId/vehicles/trailers`, async (_, res, ctx) => {
    return res(ctx.json({
      data: getAllTrailers(), // get trailer vehicles from mock vehicle store
    }));
  }),
  // Mock getting company details
  rest.get(`${MANAGE_PROFILE_API.COMPANIES}/:companyId`, async (_, res, ctx) => {
    return res(ctx.json({
      ...companyInfo,
    }));
  }),
  // Mock creating power unit vehicle
  rest.post(`${VEHICLE_URL}/companies/:companyId/vehicles/powerUnits`, async (req, res, ctx) => {
    const reqBody = await req.json();
    const newPowerUnit = createPowerUnit(reqBody); // create power unit vehicle in mock vehicle store
    return res(ctx.status(201), ctx.json({
      data: newPowerUnit
    }));
  }),
  // Mock updating power unit vehicle
  rest.put(`${VEHICLE_URL}/companies/:companyId/vehicles/powerUnits/:powerUnitId`, async (req, res, ctx) => {
    const id = String(req.params.powerUnitId);
    const reqBody = await req.json();
    const updatedPowerUnit = updatePowerUnit(id, reqBody); // update power unit vehicle in mock vehicle store
    return res(ctx.json({
      data: updatedPowerUnit,
    }));
  }),
  // Mock creating trailer vehicle
  rest.post(`${VEHICLE_URL}/companies/:companyId/vehicles/trailers`, async (req, res, ctx) => {
    const reqBody = await req.json();
    const newTrailer = createTrailer(reqBody); // create trailer vehicle in mock vehicle store
    return res(ctx.status(201), ctx.json({
      data: newTrailer
    }));
  }),
  // Mock updating trailer vehicle
  rest.put(`${VEHICLE_URL}/companies/:companyId/vehicles/trailers/:trailerId`, async (req, res, ctx) => {
    const id = String(req.params.trailerId);
    const reqBody = await req.json();
    const updatedTrailer = updatePowerUnit(id, reqBody); // update trailer vehicle in mock vehicle store
    return res(ctx.json({
      data: updatedTrailer,
    }));
  }),
);

beforeAll(() => {
  resetVehicleSource();
  resetApplicationSource();
  server.listen();
});

beforeEach(async () => {
  resetVehicleSource();
  resetApplicationSource();
  vi.resetModules();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
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

    // Assert - mock store should contain updated values
    const applicationData = await getSavedApplication();
    expect(applicationData?.permitData).not.toBeUndefined();
    expect(applicationData?.permitData?.contactDetails).not.toBeUndefined();
    expect(applicationData?.permitData?.contactDetails?.firstName).toBe(newFirstName);
    expect(applicationData?.permitData?.contactDetails?.lastName).toBe(newLastName);
    expect(applicationData?.permitData?.contactDetails?.phone1).toBe(newPhone1);
    expect(applicationData?.permitData?.contactDetails?.phone1Extension).toBe(phone1Extension);
    expect(applicationData?.permitData?.contactDetails?.phone2).toBe(newPhone2);
    expect(applicationData?.permitData?.contactDetails?.phone2Extension).toBe(phone2Extension);
    expect(applicationData?.permitData?.contactDetails?.email).toBe(newEmail);
    expect(applicationData?.permitData?.contactDetails?.fax).toBe(fax);
    
    // Assert - input fields should contain updated values
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
    const requiredMsg = "This is a required field."
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
    expect(await companyNameDisplay()).toHaveTextContent(companyInfo.legalName);
    expect(await companyClientNumberDisplay()).toHaveTextContent(companyInfo.clientNumber);
  });
});
