import { Box } from "@mui/material";
import { AxiosError } from "axios";
import { Navigate, useParams } from "react-router-dom";

import "../../../../common/components/dashboard/Dashboard.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { TermOversizeForm } from "../../pages/TermOversize/TermOversizeForm";
import { ApplicationContext } from "../../context/ApplicationContext";
import { TermOversizePay } from "../../pages/TermOversize/TermOversizePay";
import { TermOversizeReview } from "../../pages/TermOversize/TermOversizeReview";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import { Loading } from "../../../../common/pages/Loading";
import { ErrorFallback } from "../../../../common/pages/ErrorFallback";
import { useApplicationDetailsQuery } from "../../hooks/hooks";
import { PERMIT_STATUSES } from "../../types/PermitStatus";
import { APPLICATION_STEPS, ApplicationStep, ERROR_ROUTES } from "../../../../routes/constants";

const displayHeaderText = (stepKey: ApplicationStep) => {
  switch (stepKey) {
    case APPLICATION_STEPS.DETAILS:
      return "Permit Application";
    case APPLICATION_STEPS.REVIEW:
      return "Review and Confirm Details";
    case APPLICATION_STEPS.PAY:
      return "Pay for Permit";
    case APPLICATION_STEPS.HOME:
    default:
      return "Permits";
  }
};

export const ApplicationStepPage = ({
  applicationStep,
}: {
  applicationStep: ApplicationStep;
}) => {
  const companyInfoQuery = useCompanyInfoQuery();
  const { permitId } = useParams(); // Get application number from route, if there is one (for edit applications)

  // Query for the application data whenever this page is rendered
  const {
    query: applicationDataQuery,
    applicationData,
    setApplicationData,
  } = useApplicationDetailsQuery(permitId);

  const isValidPermitId = () => {
    if (!permitId) return false;
    if (permitId.trim() === "") return false;
    return !isNaN(Number(permitId.trim()));
  };

  // Permit must be an application in order to allow application-related steps
  // (ie. empty status for new application, or in progress or incomplete payment status)
  const isValidApplicationStatus = () => {
    return !applicationData?.permitStatus
      || applicationData?.permitStatus === PERMIT_STATUSES.IN_PROGRESS
      || applicationData?.permitStatus === PERMIT_STATUSES.WAITING_PAYMENT;
  };

  const renderApplicationStep = () => {
    switch (applicationStep) {
      case APPLICATION_STEPS.REVIEW:
        return <TermOversizeReview />;
      case APPLICATION_STEPS.PAY:
        return <TermOversizePay />;
      default:
        return <TermOversizeForm />;
    }
  };

  if (!isValidPermitId() && applicationStep !== APPLICATION_STEPS.DETAILS) {
    return <Navigate to={ERROR_ROUTES.NOT_FOUND} />;
  }

  if (companyInfoQuery.isLoading) {
    return <Loading />;
  }

  if (companyInfoQuery.isError) {
    if (companyInfoQuery.error instanceof AxiosError) {
      if (companyInfoQuery.error.response?.status === 401) {
        return <Navigate to={ERROR_ROUTES.UNIVERSAL_UNAUTHORIZED} />;
      }
      return <ErrorFallback error={companyInfoQuery.error.message} />;
    }
  }

  // Show loading screen while application data is being fetched
  // Note: when creating a new application, permitId will be undefined, and the query will not be performed
  // since it's disabled on invalid application numbers, but isLoading will always be (stuck) in the true state
  // We need to check for isInitialLoading state instead (see https://tanstack.com/query/latest/docs/react/guides/disabling-queries)
  if (applicationDataQuery.isInitialLoading) {
    return <Loading />;
  }

  // If no longer a valid application, then we can no longer perform application-related steps
  if (!isValidApplicationStatus()) {
    return <Navigate to={ERROR_ROUTES.NOT_FOUND} />;
  }

  return (
    <ApplicationContext.Provider
      value={{
        applicationData,
        setApplicationData,
      }}
    >
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner
          bannerText={displayHeaderText(applicationStep)}
        />
      </Box>

      {renderApplicationStep()}
    </ApplicationContext.Provider>
  );
};
