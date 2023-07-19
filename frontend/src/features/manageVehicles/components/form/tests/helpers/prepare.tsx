import { rest } from "msw";
import { setupServer } from "msw/node";
import { VEHICLES_URL } from "../../../../../../common/apiManager/endpoints/endpoints";
import { VEHICLES_API } from "../../../../apiManager/endpoints/endpoints";
import userEvent from "@testing-library/user-event";
import { renderWithClient } from "../../../../../../common/helpers/testHelper";
import { PowerUnitForm } from "../../PowerUnitForm";
import { PowerUnit, Trailer } from "../../../../types/managevehicles";
import { TrailerForm } from "../../TrailerForm";

export const defaultPowerUnitSubtypes = [
  {
    typeCode: "CONCRET",
    type: "Concrete Pumper Trucks",
    description:
      "Concrete Pumper Trucks are used to pump concrete from a cement mixer truck to where the concrete is actually needed. They travel on the highway at their equipped weight with no load.",
  },
];

export const defaultTrailerSubtypes = [
  {
    typeCode: "BOOSTER",
    type: "Boosters",
    description:
      "A Booster is similar to a jeep, but it is used behind a load.",
  },
];

const server = setupServer(
  // Mock getting power unit types
  rest.get(VEHICLES_API.POWER_UNIT_TYPES, async (_, res, ctx) => {
    return res(ctx.json([
      ...defaultPowerUnitSubtypes,
    ]));
  }),
  // Mock getting trailer types
  rest.get(VEHICLES_API.TRAILER_TYPES, async (_, res, ctx) => {
    return res(ctx.json([
      ...defaultTrailerSubtypes,
    ]));
  }),
  // Mock creating power unit vehicle
  rest.post(`${VEHICLES_URL}/companies/:companyId/vehicles/powerUnits`, async (req, res, ctx) => {
    const reqBody = await req.json();
    return res(ctx.status(201), ctx.json({
      ...reqBody,
    }));
  }),
  // Mock updating power unit vehicle
  rest.put(`${VEHICLES_URL}/companies/:companyId/vehicles/powerUnits/:powerUnitId`, async (req, res, ctx) => {
    const reqBody = await req.json();
    return res(ctx.json({
      ...reqBody,
    }));
  }),
  // Mock creating trailer vehicle
  rest.post(`${VEHICLES_URL}/companies/:companyId/vehicles/trailers`, async (req, res, ctx) => {
    const reqBody = await req.json();
    return res(ctx.status(201), ctx.json({
      ...reqBody,
    }));
  }),
  // Mock updating trailer vehicle
  rest.put(`${VEHICLES_URL}/companies/:companyId/vehicles/trailers/:trailerId`, async (req, res, ctx) => {
    const reqBody = await req.json();
    return res(ctx.json({
      ...reqBody,
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

export const renderTestPowerUnitForm = (powerUnit?: PowerUnit) => {
  const user = userEvent.setup();
  const component = renderWithClient(
    <PowerUnitForm powerUnit={powerUnit} />
  );

  return { user, component };
};

export const renderTestTrailerForm = (trailer?: Trailer) => {
  const user = userEvent.setup();
  const component = renderWithClient(
    <TrailerForm trailer={trailer} />
  );

  return { user, component };
};

const commonVehicleDetails = {
  newUnitNumber: "Ken10",
  newMake: "Kenworth",
  newYear: 2020,
  newVin: "123456",
  newPlate: "ABC123",
  newCountry: "Canada",
  newProvince: "Alberta",
};

export const powerUnitDetails = {
  ...commonVehicleDetails,
  newGvw: 85000,
  newTireSize: "300",
  newSubtype: defaultPowerUnitSubtypes[0].type,
};

export const trailerDetails = {
  ...commonVehicleDetails,
  newSubtype: defaultTrailerSubtypes[0].type,
};
