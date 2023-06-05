import { Box } from "@mui/material";
import "../../../../common/components/dashboard/Dashboard.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { TermOversizeForm } from "../../pages/TermOversize/TermOversizeForm";
import { ApplicationContext } from "../../context/ApplicationContext";
import { TermOversizePay } from "../../pages/TermOversize/TermOversizePay";
import { TermOversizeReview } from "../../pages/TermOversize/TermOversizeReview";
import { useMultiStepForm } from "../../hooks/useMultiStepForm";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import { Loading } from "../../../../common/pages/Loading";
import { AxiosError } from "axios";
import { Unauthorized } from "../../../../common/pages/Unauthorized";
import { ErrorFallback } from "../../../../common/pages/ErrorFallback";
import { useParams } from "react-router-dom";
import { useApplicationDetailsQuery } from "../../hooks/hooks";

export enum ApplicationStep {
  Form = "Form",
  Review = "Review",
  Pay = "Pay",
}

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
    //steps,
    currentStepIndex,
    step,
    //isFirstStep,
    //isLastStep,
    back,
    next,
    goTo,
  } = useMultiStepForm([
    <TermOversizeForm key={ApplicationStep.Form} />,
    <TermOversizeReview key={ApplicationStep.Review} />,
    <TermOversizePay key={ApplicationStep.Pay} />,
  ]);

  const displayHeaderText = () => {
    switch (step.key) {
      case ApplicationStep.Form:
        return "Permit Application";
      case ApplicationStep.Review:
        return "Review and Confirm Details";
      case ApplicationStep.Pay:
        return "Pay for Permit";
      default:
        return "";
    }
  };

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
        <Banner bannerText={displayHeaderText()} extendHeight={true} />
      </Box>

      {step}
    </ApplicationContext.Provider>
  );
};
