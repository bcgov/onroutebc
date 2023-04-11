import { Box, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { BC_COLOURS } from "../../../../../themes/bcGovStyles";
import { ApplicationContext } from "../../../context/ApplicationContext";
import { ApplicationStep } from "../../dashboard/PermitApplicationDashboard";

export const TermOversizePay = () => {
  const { applicationData, back, goTo } = useContext(ApplicationContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Box
        className="layout-box"
        sx={{
          display: "flex",
          height: "60px",
          alignItems: "center",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Typography
          sx={{
            color: BC_COLOURS.bc_text_links_blue,
            cursor: "pointer",
            marginRight: "8px",
            textDecoration: "underline",
          }}
          onClick={() =>
            goTo(Object.keys(ApplicationStep).indexOf(ApplicationStep.Form))
          }
        >
          Permits
        </Typography>
        <i
          className="fa fa-chevron-right"
          style={{ marginLeft: "8px", marginRight: "8px" }}
        ></i>
        <Typography
          sx={{
            color: BC_COLOURS.bc_text_links_blue,
            cursor: "pointer",
            marginRight: "8px",
            textDecoration: "underline",
          }}
          onClick={() =>
            goTo(Object.keys(ApplicationStep).indexOf(ApplicationStep.Form))
          }
        >
          Permit Application
        </Typography>
        <i
          className="fa fa-chevron-right"
          style={{ marginLeft: "8px", marginRight: "8px" }}
        ></i>
        <Typography
          sx={{
            color: BC_COLOURS.bc_text_links_blue,
            cursor: "pointer",
            marginRight: "8px",
            textDecoration: "underline",
          }}
          onClick={() => back()}
        >
          Review and Confirm Details
        </Typography>
        <i
          className="fa fa-chevron-right"
          style={{ marginLeft: "8px", marginRight: "8px" }}
        ></i>
        <Typography>Pay for Permit</Typography>
      </Box>
      <Box
        className="layout-box"
        sx={{
          paddingTop: "24px",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Typography>TODO</Typography>
        <Typography>Application Data:</Typography>
        <pre>{JSON.stringify(applicationData, null, 2)}</pre>
      </Box>
    </>
  );
};
