import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

import { renderWithClient } from "../../../../../../common/helpers/testHelper";
import OnRouteBCContext from "../../../../../../common/authentication/OnRouteBCContext";
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
import { getDefaultUserDetails } from "./fixtures/getUserDetails";
import { getDefaultCompanyInfo } from "./fixtures/getCompanyInfo";
import { createApplication, getApplication, resetApplicationSource, updateApplication } from "./fixtures/getActiveApplication";
import { dayjsToUtcStr, now } from "../../../../../../common/helpers/formatDate";
import { ApplicationDashboard } from "../../ApplicationDashboard";

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

// Mock API endpoints
const server = setupServer(
  // Mock creating/saving application
  rest.post(PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT, async (req, res, ctx) => {
    const reqBody = await req.json();
    const applicationData = { 
      ...reqBody,
      applicationNumber: `A1-00000001-800-R01`,
      createdDateTime: dayjsToUtcStr(now()),
      updatedDateTime: dayjsToUtcStr(now()),
    };
    const createdApplication = createApplication(applicationData); // add to mock application store
    return res(ctx.status(201), ctx.json({
      data: createdApplication,
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
      data: updatedApplication,
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
  rest.get(`${VEHICLE_URL}/companies/:companyId`, async (_, res, ctx) => {
    return res(ctx.json({
      data: getDefaultCompanyInfo(),
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

describe("Application display", () => {
  it("should properly display Contact Details", async () => {
    // Arrange and Act
    renderWithClient(
      <OnRouteBCContext.Provider value={defaultUserDetails}>
        <ApplicationDashboard />
      </OnRouteBCContext.Provider>
    );

    // Assert - should show proper info for the default user details passed in
    expect(await screen.findByDisplayValue(firstName)).toBeVisible();
    expect(await screen.findByDisplayValue(lastName)).toBeVisible();
    expect(await screen.findByDisplayValue(phone1)).toBeVisible();
    expect(await screen.findByDisplayValue(phone1Extension)).toBeVisible();
    expect(await screen.findByDisplayValue(phone2)).toBeVisible();
    expect(await screen.findByDisplayValue(phone2Extension)).toBeVisible();
    expect(await screen.findByDisplayValue(email)).toBeVisible();
    expect(await screen.findByDisplayValue(fax)).toBeVisible();
    expect(await screen.findByText(/The permit will be sent to the email/i)).toBeInTheDocument();
  });
});

describe("Application editing", () => {
  it("should properly edit Contact Details", async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithClient(
      <OnRouteBCContext.Provider value={defaultUserDetails}>
        <ApplicationDashboard />
      </OnRouteBCContext.Provider>
    );

    const firstNameInput = await screen.findByDisplayValue(firstName);
    const lastNameInput = await screen.findByDisplayValue(lastName);
    const phone1Input = await screen.findByDisplayValue(phone1);
    const phone1ExtInput = await screen.findByDisplayValue(phone1Extension);
    const phone2Input = await screen.findByDisplayValue(phone2);
    const phone2ExtInput = await screen.findByDisplayValue(phone2Extension);
    const emailInput = await screen.findByDisplayValue(email);
    const faxInput = await screen.findByDisplayValue(fax);

    // Act - change various input field values and save application
    await user.click(firstNameInput);
    await user.pointer([{target: firstNameInput, offset: 0, keys: '[MouseLeft>]'}, {offset: firstName.length}]);
    const newFirstName = "Myfirstname";
    await user.paste(newFirstName);
    await user.click(lastNameInput);
    await user.pointer([{target: lastNameInput, offset: 0, keys: '[MouseLeft>]'}, {offset: lastName.length}]);
    const newLastName = "Mylastname";
    await user.paste(newLastName);
    await user.click(phone1Input);
    await user.pointer([{target: phone1Input, offset: 0, keys: '[MouseLeft>]'}, {offset: phone1.length}]);
    const newPhone1 = formatPhoneNumber("778-123-4567");
    await user.paste(newPhone1);
    await user.click(phone2Input);
    await user.pointer([{target: phone2Input, offset: 0, keys: '[MouseLeft>]'}, {offset: phone2.length}]);
    const newPhone2 = formatPhoneNumber("778-123-4568");
    await user.paste(newPhone2);
    await user.click(emailInput);
    await user.pointer([{target: emailInput, offset: 0, keys: '[MouseLeft>]'}, {offset: email.length}]);
    const newEmail = "mc@mycompany.co";
    await user.paste(newEmail);
    const saveBtn = await screen.findByText(/^Save$/i);
    await user.click(saveBtn);

    // Assert - mock store should contain updated values
    await waitFor(() => {
      expect(getApplication()).not.toBeUndefined();
    });
    const applicationData = getApplication();
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
    expect(screen.getByText(/The permit will be sent to the email/i)).toBeInTheDocument();
  });

  it("should show validation errors when submitting empty contact details", async () => {
    // Arrange
    const user = userEvent.setup();
    const emptyUserDetails = {
      companyId: 74,
      userDetails: {
        firstName: "",
        lastName: "",
        userName: "",
        phone1: "",
        phone1Extension: "",
        phone2: "",
        phone2Extension: "",
        email: "",
        fax: "",
      },
    };
    renderWithClient(
      <OnRouteBCContext.Provider value={emptyUserDetails}>
        <ApplicationDashboard />
      </OnRouteBCContext.Provider>
    );

    // Act - click 'continue' when contact details fields are empty
    const continueBtn = await screen.findByText(/^Continue$/i);
    await user.click(continueBtn);

    // Assert - error messages should be displayed
    const requiredMsg = "This is a required field."
    expect(await screen.findByTestId("alert-permitData.contactDetails.firstName")).toHaveTextContent(requiredMsg);
    expect(await screen.findByTestId("alert-permitData.contactDetails.lastName")).toHaveTextContent(requiredMsg);
    expect(await screen.findByTestId("alert-permitData.contactDetails.phone1")).toHaveTextContent(requiredMsg);
    expect(await screen.findByTestId("alert-permitData.contactDetails.email")).toHaveTextContent(requiredMsg);
  });
});
