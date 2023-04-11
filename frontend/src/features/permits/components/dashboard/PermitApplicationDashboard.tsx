import { Box } from "@mui/material";
import "../../../../common/components/dashboard/Dashboard.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { TermOversizeForm } from "../form/TermOversizePermit/TermOversizeForm";
import { ApplicationContext } from "../../context/ApplicationContext";
import { useState } from "react";
import { TermOversizeApplication } from "../../types/application";
import { TermOversizeReview } from "../form/TermOversizePermit/TermOversizeReview";
import { useMultiStepForm } from "../../apiManager/hooks";
import { TermOversizePay } from "../form/TermOversizePermit/TermOversizePay";

export enum ApplicationStep {
  Form = "Form",
  Review = "Review",
  Pay = "Pay",
}

export const PermitApplicationDashboard = () => {
  const [applicationData, setApplicationData] =
    useState<TermOversizeApplication>();

  const {
    steps,
    currentStepIndex,
    step,
    isFirstStep,
    isLastStep,
    back,
    next,
    goTo,
  } = useMultiStepForm([
    <TermOversizeForm key={ApplicationStep.Form} />,
    <TermOversizeReview key={ApplicationStep.Review} />,
    <TermOversizePay key={ApplicationStep.Pay} />,

    // <TermOversizeReview key={ApplicationStep.Form} />,
    // <TermOversizeForm key={ApplicationStep.Review} />,
    // <TermOversizeReview key={ApplicationStep.Pay} />,
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

  return (
    <ApplicationContext.Provider
      value={{
        applicationData: applicationData,
        setApplicationData: setApplicationData,
        next,
        back,
        goTo,
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
