import { ThemeProvider } from "@mui/material/styles";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

import { renderWithClient } from "../../../../../../../common/helpers/testHelper";
import OnRouteBCContext, { OnRouteBCContextType } from "../../../../../../../common/authentication/OnRouteBCContext";
import { bcGovTheme } from "../../../../../../../themes/bcGovTheme";
import { ApplicationDashboard } from "../../../ApplicationDashboard";
import { PERMITS_API } from "../../../../../apiManager/endpoints/endpoints";
import { dayjsToUtcStr, now } from "../../../../../../../common/helpers/formatDate";
import { createApplication, getApplication, updateApplication } from "../fixtures/getActiveApplication";
import { VEHICLES_API } from "../../../../../../manageVehicles/apiManager/endpoints/endpoints";
import { VEHICLES_URL } from "../../../../../../../common/apiManager/endpoints/endpoints";
import { MANAGE_PROFILE_API } from "../../../../../../manageProfile/apiManager/endpoints/endpoints";
import { getDefaultCompanyInfo } from "../fixtures/getCompanyInfo";
import { getDefaultUserDetails } from "../fixtures/getUserDetails";
import { 
  createPowerUnit, 
  createTrailer, 
  getAllPowerUnitTypes, 
  getAllPowerUnits, 
  getAllTrailerTypes, 
  getAllTrailers, 
  updatePowerUnit,
} from "../fixtures/getVehicleInfo";

// Use some default user details values to give to the OnRouteBCContext context provider
export const defaultUserDetails = getDefaultUserDetails();
export const newApplicationNumber = "A1-00000001-800-R01";
export const companyInfo = getDefaultCompanyInfo();

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
  rest.get(`${VEHICLES_URL}/permits/applications/:permitId`, (_, res, ctx) => {
    return res(ctx.json({
      // get application from mock application store (there's only 1 application or empty), since we're testing save/create/edit behaviour
      data: getApplication(), 
    }));
  }),
  // Mock getting power unit types
  rest.get(VEHICLES_API.POWER_UNIT_TYPES, async (_, res, ctx) => {
    return res(ctx.json([
      ...getAllPowerUnitTypes() // get power unit types from mock vehicle store
    ]));
  }),
  // Mock getting trailer types
  rest.get(VEHICLES_API.TRAILER_TYPES, async (_, res, ctx) => {
    return res(ctx.json([
      ...getAllTrailerTypes() // get trailer types from mock vehicle store
    ]));
  }),
  // Mock getting power unit vehicles
  rest.get(`${VEHICLES_URL}/companies/:companyId/vehicles/powerUnits`, async (_, res, ctx) => {
    return res(ctx.json([
      ...getAllPowerUnits(), // get power unit vehicles from mock vehicle store
    ]));
  }),
  // Mock getting trailer vehicles
  rest.get(`${VEHICLES_URL}/companies/:companyId/vehicles/trailers`, async (_, res, ctx) => {
    return res(ctx.json([
      ...getAllTrailers(), // get trailer vehicles from mock vehicle store
    ]));
  }),
  // Mock getting company details
  rest.get(`${MANAGE_PROFILE_API.COMPANIES}/:companyId`, async (_, res, ctx) => {
    return res(ctx.json({
      ...companyInfo,
    }));
  }),
  // Mock creating power unit vehicle
  rest.post(`${VEHICLES_URL}/companies/:companyId/vehicles/powerUnits`, async (req, res, ctx) => {
    const reqBody = await req.json();
    const newPowerUnit = createPowerUnit(reqBody); // create power unit vehicle in mock vehicle store
    return res(ctx.status(201), ctx.json({
      ...newPowerUnit
    }));
  }),
  // Mock updating power unit vehicle
  rest.put(`${VEHICLES_URL}/companies/:companyId/vehicles/powerUnits/:powerUnitId`, async (req, res, ctx) => {
    const id = String(req.params.powerUnitId);
    const reqBody = await req.json();
    const updatedPowerUnit = updatePowerUnit(id, reqBody); // update power unit vehicle in mock vehicle store
    return res(ctx.json({
      ...updatedPowerUnit,
    }));
  }),
  // Mock creating trailer vehicle
  rest.post(`${VEHICLES_URL}/companies/:companyId/vehicles/trailers`, async (req, res, ctx) => {
    const reqBody = await req.json();
    const newTrailer = createTrailer(reqBody); // create trailer vehicle in mock vehicle store
    return res(ctx.status(201), ctx.json({
      ...newTrailer
    }));
  }),
  // Mock updating trailer vehicle
  rest.put(`${VEHICLES_URL}/companies/:companyId/vehicles/trailers/:trailerId`, async (req, res, ctx) => {
    const id = String(req.params.trailerId);
    const reqBody = await req.json();
    const updatedTrailer = updatePowerUnit(id, reqBody); // update trailer vehicle in mock vehicle store
    return res(ctx.json({
      ...updatedTrailer,
    }));
  }),
);

export const listenToMockServer = () => {
  server.listen();
};

export const resetMockServer = () => {
  server.resetHandlers();
};

export const closeMockServer = () => {
  server.close();
};

export const ComponentWithWrapper = (userDetails: OnRouteBCContextType) => {
  return (
    <ThemeProvider theme={bcGovTheme}>
      <OnRouteBCContext.Provider value={userDetails}>
        <ApplicationDashboard />
      </OnRouteBCContext.Provider>
    </ThemeProvider>
  );
};

export const renderTestComponent = (userDetails: OnRouteBCContextType) => {
  const user = userEvent.setup();
  const component = renderWithClient(
    ComponentWithWrapper(userDetails)
  );

  return { user, component };
};
