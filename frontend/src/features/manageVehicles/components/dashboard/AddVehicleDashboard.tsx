import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import "./AddVehicleDashboard.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { InfoBcGovBanner } from "../../../../common/components/banners/AlertBanners";
import { getCompanyIdFromSession } from "../../../../common/apiManager/httpRequestHandler";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { VEHICLE_TYPES_ENUM } from "../form/constants";
import { PowerUnitForm } from "../form/PowerUnitForm";
import { TrailerForm } from "../form/TrailerForm";

export const AddVehicleDashboard = React.memo(
  ({ addVehicleMode }: { addVehicleMode: VEHICLE_TYPES_ENUM }) => {
    const navigate = useNavigate();

    const handleShowAddVehicle = () => {
      navigate("../");
    };

    const companyId = getDefaultRequiredVal("0", getCompanyIdFromSession());

    return (
      <div className="dashboard-page">
        <Box
          className="dashboard-page__banner layout-box"
        >
          {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT && (
            <Banner bannerText={"Add Power Unit"} extendHeight={true} />
          )}
          {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && (
            <Banner bannerText={"Add Trailer"} extendHeight={true} />
          )}
        </Box>

        <Box
          className="dashboard-page__breadcrumb layout-box"
        >
          <Typography
            className="breadcrumb-link breadcrumb-link--parent"
            onClick={handleShowAddVehicle}
          >
            Vehicle Inventory
          </Typography>

          <FontAwesomeIcon
            className="breadcrumb-icon"
            icon={faChevronRight}
          />

          <Typography
            className="breadcrumb-link breadcrumb-link--parent"
            onClick={handleShowAddVehicle}
          >
            {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT && "Power Unit"}
            {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && "Trailer"}
          </Typography>

          <FontAwesomeIcon
            className="breadcrumb-icon"
            icon={faChevronRight}
          />

          <Typography>
            {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT &&
              "Add Power Unit"}
            {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && "Add Trailer"}
          </Typography>
        </Box>

        <Box
          className="dashboard-page__info-banner layout-box"
        >
          <InfoBcGovBanner
            width="880px"
            description="Please note, unless stated otherwise, all fields are mandatory."
          />
        </Box>

        <Box
          className="dashboard-page__form layout-box"
        >
          <Typography
            variant={"h2"}
          >
            {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT &&
              "Power Unit Details"}
            {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && "Trailer Details"}
          </Typography>
          {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT && (
            <PowerUnitForm companyId={companyId} />
          )}
          {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && (
            <TrailerForm companyId={companyId} />
          )}
        </Box>
      </div>
    );
  }
);

AddVehicleDashboard.displayName = "AddVehicleDashboard";
