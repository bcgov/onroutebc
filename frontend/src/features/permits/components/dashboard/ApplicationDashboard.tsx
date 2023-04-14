import { Box } from "@mui/material";
import "../../../../common/components/dashboard/Dashboard.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { TermOversizeForm } from "../../pages/TermOversize/TermOversizeForm";
import { ApplicationContext } from "../../context/ApplicationContext";
import { useMemo, useState } from "react";
import { TermOversizeApplication } from "../../types/application";
import { TermOversizePay } from "../../pages/TermOversize/TermOversizePay";
import { TermOversizeReview } from "../../pages/TermOversize/TermOversizeReview";
import { useMultiStepForm } from "../../hooks/useMultiStepForm";

export enum ApplicationStep {
  Form = "Form",
  Review = "Review",
  Pay = "Pay",
}

export const ApplicationDashboard = () => {
  const [applicationData, setApplicationData] =
    useState<TermOversizeApplication>();

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

  /**
   * Sonarcloud fix:
   * Providing values like an object to a React Context will provoke additional re-renders as React doesn’t know the object is the same.
   * This can significantly impact performance since the whole component tree will be re-rendered each time.
   * Wrapping the value in a useMemo hook will avoid additional render passes.
   */
  const memoizedValues = useMemo(
    () => ({
      applicationData: applicationData,
      setApplicationData: setApplicationData,
      next,
      back,
      goTo,
      currentStepIndex,
    }),
    []
  );

  return (
    <ApplicationContext.Provider value={memoizedValues}>
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
