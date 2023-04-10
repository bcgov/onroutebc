import { Box } from "@mui/material";
import "../../../../common/components/dashboard/Dashboard.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { TermOversizeForm } from "../form/TermOversizePermit/TermOversizeForm";
import { ApplicationContext } from "../../context/ApplicationContext";
import { useState } from "react";
import { TermOversizeApplication } from "../../types/application";
import { TermOversizeReview } from "../form/TermOversizePermit/TermOversizeReview";
import { useMultiStepForm } from "../../apiManager/hooks";

export const PermitApplicationDashboard = () => {
  const [applicationData, setApplicationData] =
    useState<TermOversizeApplication>();

  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultiStepForm([
      <TermOversizeForm key={1} />,
      <TermOversizeReview key={2} />,
    ]);

  return (
    <ApplicationContext.Provider
      value={{
        applicationData: applicationData,
        setApplicationData: setApplicationData,
        next,
        back,
      }}
    >
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner bannerText={"Permit Application"} extendHeight={true} />
      </Box>

      {step}
    </ApplicationContext.Provider>
  );
};
