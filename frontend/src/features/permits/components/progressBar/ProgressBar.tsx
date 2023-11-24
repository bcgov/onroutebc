import { Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import "./ProgressBar.scss";
import { APPLICATION_STEPS } from "../dashboard/ApplicationDashboard";
import { ApplicationContext } from "../../context/ApplicationContext";
import { APPLICATIONS_ROUTES } from "../../../../routes/constants";

export const ProgressBar = () => {
  const applicationSteps = Object.values(APPLICATION_STEPS);
  const indexForm = applicationSteps.indexOf(APPLICATION_STEPS.Form);
  const indexReview = applicationSteps.indexOf(APPLICATION_STEPS.Review);
  const indexPay = applicationSteps.indexOf(APPLICATION_STEPS.Pay);

  const { currentStepIndex, goTo } = useContext(ApplicationContext);

  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate(APPLICATIONS_ROUTES.BASE);
  };

  return (
    <Box
      className="progress-bar layout-box"
    >
      <CustomLink onClick={handleNavigateBack} label={"Permits"} />
      <ChevronRight />

      {currentStepIndex === indexForm && (
        <Typography>Permit Application</Typography>
      )}

      {currentStepIndex === indexReview && (
        <>
          <CustomLink
            onClick={() => goTo(indexForm)}
            label={"Permit Application"}
          />
          <ChevronRight />
          <Typography>Review and Confirm Details</Typography>
        </>
      )}

      {currentStepIndex === indexPay && (
        <>
          <CustomLink
            onClick={() => goTo(indexForm)}
            label={"Permit Application"}
          />
          <ChevronRight />
          <CustomLink
            onClick={() => goTo(indexReview)}
            label={"Review and Confirm Details"}
          />
          <ChevronRight />
          <Typography>Pay for Permit</Typography>
        </>
      )}
    </Box>
  );
};

const CustomLink = ({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) => (
  <Typography
    className="custom-link"
    onClick={onClick}
  >
    {label}
  </Typography>
);

const ChevronRight = () => (
  <FontAwesomeIcon
    icon={faChevronRight}
    className="chevron-right"
  />
);
