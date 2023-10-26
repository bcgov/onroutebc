import { Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { APPLICATION_STEPS } from "../dashboard/ApplicationDashboard";
import { ApplicationContext } from "../../context/ApplicationContext";

export const ProgressBar = () => {
  const applicationSteps = Object.values(APPLICATION_STEPS);
  const indexForm = applicationSteps.indexOf(APPLICATION_STEPS.Form);
  const indexReview = applicationSteps.indexOf(APPLICATION_STEPS.Review);
  const indexPay = applicationSteps.indexOf(APPLICATION_STEPS.Pay);

  const { currentStepIndex, goTo } = useContext(ApplicationContext);

  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate("../");
  };

  return (
    <Box
      className="layout-box"
      sx={{
        display: "flex",
        height: "60px",
        alignItems: "center",
        backgroundColor: BC_COLOURS.white,
      }}
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
    sx={{
      color: BC_COLOURS.bc_text_links_blue,
      cursor: "pointer",
      marginRight: "8px",
      textDecoration: "underline",
    }}
    onClick={onClick}
  >
    {label}
  </Typography>
);

const ChevronRight = () => (
  <FontAwesomeIcon
    icon={faChevronRight}
    style={{ marginLeft: "8px", marginRight: "8px" }}
  />
);
