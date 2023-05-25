import React from "react";
import { VEHICLE_TYPES_ENUM } from "../form/constants";
import { PowerUnitForm } from "../form/PowerUnitForm";
import { TrailerForm } from "../form/TrailerForm";
import { Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import "../../../../common/components/dashboard/Dashboard.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { InfoBcGovBanner } from "../../../../common/components/banners/AlertBanners";
import { useNavigate } from "react-router-dom";

export const AddVehicleDashboard = React.memo(
  ({ addVehicleMode }: { addVehicleMode: VEHICLE_TYPES_ENUM }) => {
    const navigate = useNavigate();

    const handleShowAddVehicle = () => {
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
          {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT && (
            <Banner bannerText={"Add Power Unit"} extendHeight={true} />
          )}
          {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && (
            <Banner bannerText={"Add Trailer"} extendHeight={true} />
          )}
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
            onClick={handleShowAddVehicle}
            sx={{
              color: BC_COLOURS.bc_text_links_blue,
              cursor: "pointer",
              marginRight: "8px",
              textDecoration: "underline",
            }}
          >
            Vehicle Inventory
          </Typography>
          <FontAwesomeIcon
            icon={faChevronRight}
            style={{ marginLeft: "8px", marginRight: "8px" }}
          />
          <Typography
            onClick={handleShowAddVehicle}
            style={{
              color: BC_COLOURS.bc_text_links_blue,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT && "Power Unit"}
            {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && "Trailer"}
          </Typography>
          <FontAwesomeIcon
            icon={faChevronRight}
            style={{ marginLeft: "8px", marginRight: "8px" }}
          />
          <Typography>
            {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT &&
              "Add Power Unit"}
            {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && "Add Trailer"}
          </Typography>
        </Box>

        <Box
          className="layout-box"
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: BC_COLOURS.white,
          }}
        >
          <InfoBcGovBanner
            width="880px"
            description="Please note, unless stated otherwise, all fields are mandatory."
          />
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
            {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT &&
              "Power Unit Details"}
            {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && "Trailer Details"}
          </Typography>
          {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT && (
            <PowerUnitForm />
          )}
          {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && <TrailerForm />}
        </Box>
      </>
    );
  }
);

AddVehicleDashboard.displayName = "AddVehicleDashboard";
