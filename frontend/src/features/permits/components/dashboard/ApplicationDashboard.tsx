import { Box } from "@mui/material";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";

import "../../../../common/components/dashboard/Dashboard.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { TermOversizeForm } from "../../pages/TermOversize/TermOversizeForm";
import { ApplicationContext } from "../../context/ApplicationContext";
import { TermOversizePay } from "../../pages/TermOversize/TermOversizePay";
import { TermOversizeReview } from "../../pages/TermOversize/TermOversizeReview";
import { useMultiStepForm } from "../../hooks/useMultiStepForm";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import { Loading } from "../../../../common/pages/Loading";
import { Unauthorized } from "../../../../common/pages/Unauthorized";
import { ErrorFallback } from "../../../../common/pages/ErrorFallback";
import { useApplicationDetailsQuery } from "../../hooks/hooks";

export const APPLICATION_STEPS = {
  Form: "Form",
  Review: "Review",
  Pay: "Pay",
} as const;

export type ApplicationStep = typeof APPLICATION_STEPS[keyof typeof APPLICATION_STEPS];

const displayHeaderText = (stepKey: ApplicationStep) => {
  switch (stepKey) {
    case APPLICATION_STEPS.Form:
      return "Permit Application";
    case APPLICATION_STEPS.Review:
      return "Review and Confirm Details";
    case APPLICATION_STEPS.Pay:
      return "Pay for Permit";
  }
};

export const ApplicationDashboard = () => {
  const companyInfoQuery = useCompanyInfoQuery();
  const { applicationNumber } = useParams(); // Get application number from route, if there is one (for edit applications)

  // Query for the application data whenever this page is rendered
  const { 
    query: applicationDataQuery, 
    applicationData, 
    setApplicationData 
  } = useApplicationDetailsQuery(applicationNumber);

  const {
    currentStepIndex,
    step,
    back,
    next,
    goTo,
  } = useMultiStepForm([
    <TermOversizeForm key={APPLICATION_STEPS.Form} />,
    <TermOversizeReview key={APPLICATION_STEPS.Review} />,
    <TermOversizePay key={APPLICATION_STEPS.Pay} />,
  ]);

  if (companyInfoQuery.isLoading) {
    return <Loading />;
  }

  if (companyInfoQuery.isError) {
    if (companyInfoQuery.error instanceof AxiosError) {
      if (companyInfoQuery.error.response?.status === 401) {
        return <Unauthorized />;
      }
      return <ErrorFallback error={companyInfoQuery.error.message} />;
    }
  }

  // Show loading screen while application data is being fetched
  // Note: when creating a new application, applicationNumber will be undefined, and the query will not be performed
  // since it's disabled on invalid application numbers, but isLoading will always be (stuck) in the true state
  // We need to check for isInitialLoading state instead (see https://tanstack.com/query/latest/docs/react/guides/disabling-queries)
  if (applicationDataQuery.isInitialLoading) {
    return <Loading />;
  }

  return (
    <ApplicationContext.Provider
      value={{
        applicationData,
        setApplicationData,
        next,
        back,
        goTo,
        currentStepIndex,
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
          bannerText={displayHeaderText(step.key as ApplicationStep)}
          extendHeight={true}
        />
      </Box>

      {step}
    </ApplicationContext.Provider>
  );
};
