import { useState, useMemo } from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";

import { PERMITS_API } from "../../../../../apiManager/endpoints/endpoints";
import {
  dayjsToUtcStr,
  now,
  toLocalDayjs,
} from "../../../../../../../common/helpers/formatDate";
import { renderWithClient } from "../../../../../../../common/helpers/testHelper";
import { Application } from "../../../../../types/application";
import { bcGovTheme } from "../../../../../../../themes/bcGovTheme";
import { ApplicationContext } from "../../../../../context/ApplicationContext";
import { TermOversizeReview } from "../../../TermOversizeReview";
import { getDefaultApplication } from "../../../../../components/dashboard/tests/integration/fixtures/getActiveApplication";
import { MANAGE_PROFILE_API } from "../../../../../../manageProfile/apiManager/endpoints/endpoints";
import { getDefaultCompanyInfo } from "../../../../../components/dashboard/tests/integration/fixtures/getCompanyInfo";
import { VEHICLES_API } from "../../../../../../manageVehicles/apiManager/endpoints/endpoints";
import {
  getDefaultPowerUnitTypes,
  getDefaultTrailerTypes,
} from "../../../../../components/dashboard/tests/integration/fixtures/getVehicleInfo";

export const newApplicationNumber = "A1-00000001-800-R01";
const { permitData, ...otherDetails } = getDefaultApplication();
export const vehicleDetails = permitData.vehicleDetails;
export const defaultApplicationData = {
  ...otherDetails,
  applicationNumber: newApplicationNumber,
  createdDateTime: now(),
  updatedDateTime: now(),
  permitData: {
    ...permitData,
    startDate: toLocalDayjs(permitData.startDate),
    expiryDate: toLocalDayjs(permitData.expiryDate),
  },
} as Application;

export const companyInfo = getDefaultCompanyInfo();
export const companyInfoTitle = "Company Information";
export const companyInfoDescription =
  "If the Company Mailing Address is incorrect, please contact your onRouteBC Administrator.";
export const companyMailAddrTitle = "Company Mailing Address";
export const contactInfoTitle = "Contact Information";
export const vehicleSubtypes = [
  ...getDefaultPowerUnitTypes(),
  ...getDefaultTrailerTypes(),
];

const server = setupServer(
  rest.get(
    `${MANAGE_PROFILE_API.COMPANIES}/:companyId`,
    async (_, res, ctx) => {
      return res(
        ctx.json({
          ...companyInfo,
        }),
      );
    },
  ),
  rest.post(
    `${PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT}`,
    async (req, res, ctx) => {
      const reqBody = await req.json();
      const applicationData = {
        ...reqBody,
        applicationNumber: newApplicationNumber,
        createdDateTime: dayjsToUtcStr(now()),
        updatedDateTime: dayjsToUtcStr(now()),
      };
      return res(
        ctx.status(201),
        ctx.json({
          ...applicationData,
        }),
      );
    },
  ),
  rest.put(
    `${PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT}/:id`,
    async (req, res, ctx) => {
      const reqBody = await req.json();
      const applicationData = {
        ...reqBody,
        updatedDateTime: dayjsToUtcStr(now()),
      };
      return res(
        ctx.status(200),
        ctx.json({
          ...applicationData,
        }),
      );
    },
  ),
  rest.get(VEHICLES_API.POWER_UNIT_TYPES, async (_, res, ctx) => {
    return res(
      ctx.json([
        ...getDefaultPowerUnitTypes(), // get power unit types from mock vehicle store
      ]),
    );
  }),
  rest.get(VEHICLES_API.TRAILER_TYPES, async (_, res, ctx) => {
    return res(
      ctx.json([
        ...getDefaultTrailerTypes(), // get trailer types from mock vehicle store
      ]),
    );
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

const ComponentWithWrapper = ({
  applicationData,
}: {
  applicationData: Application;
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [testApplicationData, setTestApplicationData] =
    useState(applicationData);
  const next = () => setStepIndex((currentStepIndex) => currentStepIndex + 1);
  const back = () => setStepIndex((currentStepIndex) => currentStepIndex - 1);
  const goTo = (stepIndex: number) => setStepIndex(stepIndex);
  return (
    <ThemeProvider theme={bcGovTheme}>
      <ApplicationContext.Provider
        value={useMemo(
          () => ({
            applicationData: testApplicationData,
            setApplicationData: setTestApplicationData,
            next,
            back,
            goTo,
            currentStepIndex: stepIndex,
          }),
          [testApplicationData, stepIndex],
        )}
      >
        <TermOversizeReview />
      </ApplicationContext.Provider>
    </ThemeProvider>
  );
};

export const renderTestComponent = (applicationData: Application) => {
  const user = userEvent.setup();
  const component = renderWithClient(
    <ComponentWithWrapper applicationData={applicationData} />,
  );

  return { user, component };
};
