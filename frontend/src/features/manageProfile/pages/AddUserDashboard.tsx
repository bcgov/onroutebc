import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography, Divider } from "@mui/material";
import React from "react";

import { useNavigate } from "react-router-dom";
// import "../../../../common/components/dashboard/Dashboard.scss";
import { BC_COLOURS } from "../../../themes/bcGovStyles";

export const AddUserDashboard = React.memo(() => {
  const navigate = useNavigate();

  const onClickBreadCrumb = () => {
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
        Add User
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
          onClick={onClickBreadCrumb}
          sx={{
            color: BC_COLOURS.bc_text_links_blue,
            cursor: "pointer",
            marginRight: "8px",
            textDecoration: "underline",
          }}
        >
          Profile
        </Typography>
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ marginLeft: "8px", marginRight: "8px" }}
        />
        <Typography
          onClick={onClickBreadCrumb}
          style={{
            color: BC_COLOURS.bc_text_links_blue,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          User Management
        </Typography>
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ marginLeft: "8px", marginRight: "8px" }}
        />
        <Typography>Add User</Typography>
      </Box>

      <Box
        className="layout-box"
        sx={{
          display: "flex",
          paddingTop: "24px",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Typography
          variant={"h2"}
          sx={{
            marginRight: "200px",
            marginTop: "0px",
            paddingTop: "0px",
          }}
        >
          User ID
        </Typography>
        {/* Form Component */}
      </Box>
      <Divider variant="middle" />
      <Box
        className="layout-box"
        sx={{
          display: "flex",
          paddingTop: "24px",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Typography
          variant={"h2"}
          sx={{
            marginRight: "200px",
            marginTop: "0px",
            paddingTop: "0px",
          }}
        >
          Assign User Group
        </Typography>
        {/* Form Component */}
      </Box>
    </>
  );
});

AddUserDashboard.displayName = "AddVehicleDashboard";
