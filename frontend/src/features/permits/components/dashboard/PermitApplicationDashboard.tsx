import { Box, Typography } from "@mui/material";

import "../../../../common/components/dashboard/Dashboard.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { useNavigate } from "react-router-dom";
import { TermOversizeForm } from "../form/TermOversizeForm";

export const PermitApplicationDashboard = () => {
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate("../");
  };

  return (
    <>
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner bannerText={"Permit Application"} extendHeight={true} />
      </Box>
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
          onClick={handleNavigateBack}
          sx={{
            color: BC_COLOURS.bc_text_links_blue,
            cursor: "pointer",
            marginRight: "8px",
            textDecoration: "underline",
          }}
        >
          Permits
        </Typography>
        <i
          className="fa fa-chevron-right"
          style={{ marginLeft: "8px", marginRight: "8px" }}
        ></i>
        <Typography>Permit Application</Typography>
      </Box>

      <Box
        className="layout-box"
        sx={{
          paddingTop: "24px",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <TermOversizeForm />
      </Box>
    </>
  );
};
