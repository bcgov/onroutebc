import { useState, useMemo } from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";

import { APPLICATIONS_API_ROUTES } from "../../../../../apiManager/endpoints/endpoints";
import { renderWithClient } from "../../../../../../../common/helpers/testHelper";
import {
  Application,
  ApplicationRequestData,
} from "../../../../../types/application";
import { bcGovTheme } from "../../../../../../../themes/bcGovTheme";
import { ApplicationContext } from "../../../../../context/ApplicationContext";
import { TermOversizeReview } from "../../../TermOversizeReview";
import { getDefaultApplication } from "../../../../../components/dashboard/tests/integration/fixtures/getActiveApplication";
import { MANAGE_PROFILE_API } from "../../../../../../manageProfile/apiManager/endpoints/endpoints";
import { getDefaultCompanyInfo } from "../../../../../components/dashboard/tests/integration/fixtures/getCompanyInfo";
import { VEHICLES_API } from "../../../../../../manageVehicles/apiManager/endpoints/endpoints";
import { Nullable } from "../../../../../../../common/types/common";
import {
  dayjsToUtcStr,
  getEndOfDate,
  getStartOfDate,
  now,
  toLocalDayjs,
} from "../../../../../../../common/helpers/formatDate";

import {
  getDefaultPowerUnitSubTypes,
  getDefaultTrailerSubTypes,
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
    startDate: getStartOfDate(toLocalDayjs(permitData.startDate)),
    expiryDate: getEndOfDate(toLocalDayjs(permitData.expiryDate)),
  },
} as Application;

export const companyInfo = getDefaultCompanyInfo();
export const companyInfoTitle = "Company Information";
export const companyInfoDescription =
  "If the Company Mailing Address is incorrect, please contact your onRouteBC Administrator.";
export const companyMailAddrTitle = "Company Mailing Address";
export const contactInfoTitle = "Contact Information";
export const vehicleSubtypes = [
  ...getDefaultPowerUnitSubTypes(),
  ...getDefaultTrailerSubTypes(),
];

const server = setupServer(
  http.get(`${MANAGE_PROFILE_API.COMPANIES}/:companyId`, () => {
    return HttpResponse.json({
      ...companyInfo,
    });
  }),

  http.post(`${APPLICATIONS_API_ROUTES.CREATE}`, async ({ request }) => {
    const reqBody = await request.json();
    const application = reqBody?.valueOf();
    if (!application) {
      return HttpResponse.json(null, { status: 400 });
    }

    const applicationData = {
      ...(application as ApplicationRequestData),
      applicationNumber: newApplicationNumber,
      createdDateTime: dayjsToUtcStr(now()),
      updatedDateTime: dayjsToUtcStr(now()),
    };

    return HttpResponse.json(
      {
        ...applicationData,
      },
      { status: 201 },
    );
  }),

  http.put(`${APPLICATIONS_API_ROUTES.UPDATE}/:id`, async ({ request }) => {
    const reqBody = await request.json();
    const application = reqBody?.valueOf();
    if (!application) {
      return HttpResponse.json(null, { status: 400 });
    }

    const applicationData = {
      ...(application as ApplicationRequestData),
      updatedDateTime: dayjsToUtcStr(now()),
    };
    return HttpResponse.json(
      {
        ...applicationData,
      },
      { status: 200 },
    );
  }),

  http.get(VEHICLES_API.POWER_UNIT_TYPES, () => {
    return HttpResponse.json([
      ...getDefaultPowerUnitSubTypes(), // get power unit subtypes from mock vehicle store
    ]);
  }),

  http.get(VEHICLES_API.TRAILER_TYPES, () => {
    return HttpResponse.json([
      ...getDefaultTrailerSubTypes(), // get trailer subtypes from mock vehicle store
    ]);
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
  const [testApplicationData, setTestApplicationData] =
    useState<Nullable<Application>>(applicationData);

  return (
    <ThemeProvider theme={bcGovTheme}>
      <ApplicationContext.Provider
        value={useMemo(
          () => ({
            applicationData: testApplicationData,
            setApplicationData: setTestApplicationData,
          }),
          [testApplicationData],
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
