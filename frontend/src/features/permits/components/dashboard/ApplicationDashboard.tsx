import { Box } from "@mui/material";
import "../../../../common/components/dashboard/Dashboard.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { TermOversizeForm } from "../../pages/TermOversize/TermOversizeForm";
import { ApplicationContext } from "../../context/ApplicationContext";
import { useState } from "react";
import { TermOversizeApplication } from "../../types/application";
import { TermOversizePay } from "../../pages/TermOversize/TermOversizePay";
import { TermOversizeReview } from "../../pages/TermOversize/TermOversizeReview";
import { useMultiStepForm } from "../../hooks/useMultiStepForm";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import { Loading } from "../../../../common/pages/Loading";
import { AxiosError } from "axios";
import { Unauthorized } from "../../../../common/pages/Unauthorized";
import { ErrorFallback } from "../../../../common/pages/ErrorFallback";

export enum ApplicationStep {
  Form = "Form",
  Review = "Review",
  Pay = "Pay",
}

export const ApplicationDashboard = () => {
  const [applicationData, setApplicationData] =
    useState<TermOversizeApplication>();

  const companyInfoQuery = useCompanyInfoQuery();

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

  return (
    <ApplicationContext.Provider
      value={{
        applicationData: applicationData,
        setApplicationData: setApplicationData,
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
