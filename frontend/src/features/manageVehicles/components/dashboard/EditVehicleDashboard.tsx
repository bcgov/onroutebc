import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import "./EditVehicleDashboard.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { InfoBcGovBanner } from "../../../../common/components/banners/InfoBcGovBanner";
import { VEHICLE_TYPES_ENUM } from "../form/constants";
import { PowerUnitForm } from "../form/PowerUnitForm";
import { TrailerForm } from "../form/TrailerForm";
import { PowerUnit, Trailer } from "../../types/managevehicles";
import { DATE_FORMATS, toLocal } from "../../../../common/helpers/formatDate";
import { getCompanyIdFromSession } from "../../../../common/apiManager/httpRequestHandler";
import { VEHICLES_ROUTES } from "../../../../routes/constants";
import { useVehicleByIdQuery } from "../../apiManager/hooks";
import { Loading } from "../../../../common/pages/Loading";
import { Unexpected } from "../../../../common/pages/Unexpected";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";

export const EditVehicleDashboard = React.memo(
  ({ editVehicleMode }: { editVehicleMode: VEHICLE_TYPES_ENUM }) => {
    const navigate = useNavigate();
    const { vehicleId } = useParams();
    const companyId = getDefaultRequiredVal("0", getCompanyIdFromSession());

    const isEditPowerUnit = (editVehicleMode: VEHICLE_TYPES_ENUM) =>
      editVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT;
    const isEditTrailer = (editVehicleMode: VEHICLE_TYPES_ENUM) =>
      editVehicleMode === VEHICLE_TYPES_ENUM.TRAILER;
    
    const { vehicle: vehicleToEdit } = useVehicleByIdQuery(
      companyId,
      isEditPowerUnit(editVehicleMode) ? "powerUnit" : "trailer",
      vehicleId
    );

    const backToVehicleInventory = () => {
      if (editVehicleMode === VEHICLE_TYPES_ENUM.TRAILER) {
        navigate(VEHICLES_ROUTES.TRAILER_TAB);
      } else {
        navigate(VEHICLES_ROUTES.MANAGE);
      }
    };

    if (typeof vehicleToEdit === "undefined") {
      return <Loading />;
    }

    if (!vehicleToEdit) {
      return <Unexpected />;
    }

    return (
      <div className="dashboard-page">
        <Box className="dashboard-page__banner layout-box">
          {(isEditPowerUnit(editVehicleMode) ||
            isEditTrailer(editVehicleMode)) && (
            <Banner
              bannerText={`Edit ${
                isEditPowerUnit(editVehicleMode) ? "Power Unit" : "Trailer"
              }`}
              // Replace with a grid structure
              bannerSubtext={
                <div>
                  <strong>Date Created:</strong>
                  &nbsp;
                  {applyWhenNotNullable(
                    (dateTimeStr: string) =>
                      toLocal(dateTimeStr, DATE_FORMATS.SHORT),
                    vehicleToEdit?.createdDateTime,
                    "",
                  )}
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  <strong>Last Updated:</strong>&nbsp;{" "}
                  {getDefaultRequiredVal(
                    "",
                    applyWhenNotNullable(
                      (dateTimeStr: string) =>
                        toLocal(dateTimeStr, DATE_FORMATS.SHORT),
                      vehicleToEdit?.updatedDateTime,
                    ),
                    applyWhenNotNullable(
                      (dateTimeStr: string) =>
                        toLocal(dateTimeStr, DATE_FORMATS.SHORT),
                      vehicleToEdit?.createdDateTime,
                      "",
                    ),
                  )}
                </div>
              }
              extendHeight={true}
            />
          )}
        </Box>

        <Box className="dashboard-page__breadcrumb layout-box">
          <Typography
            className="breadcrumb-link breadcrumb-link--parent"
            onClick={backToVehicleInventory}
          >
            Vehicle Inventory
          </Typography>

          <FontAwesomeIcon className="breadcrumb-icon" icon={faChevronRight} />

          <Typography
            className="breadcrumb-link breadcrumb-link--parent"
            onClick={backToVehicleInventory}
          >
            {editVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT && "Power Unit"}
            {editVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && "Trailer"}
          </Typography>

          <FontAwesomeIcon className="breadcrumb-icon" icon={faChevronRight} />

          <Typography>
            {editVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT &&
              "Edit Power Unit"}
            {editVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && "Edit Trailer"}
          </Typography>
        </Box>

        <Box className="dashboard-page__info-banner layout-box">
          <InfoBcGovBanner
            msg="Please note, unless stated otherwise, all fields are mandatory."
          />
        </Box>

        <Box className="dashboard-page__form layout-box">
          <Typography variant={"h2"}>
            {editVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT &&
              "Power Unit Details"}
            {editVehicleMode === VEHICLE_TYPES_ENUM.TRAILER &&
              "Trailer Details"}
          </Typography>
          {isEditPowerUnit(editVehicleMode) ? (
            <PowerUnitForm 
              powerUnit={vehicleToEdit as PowerUnit} 
              companyId={companyId} 
            />
          ) : (
            <TrailerForm 
              trailer={vehicleToEdit as Trailer} 
              companyId={companyId} 
            />
          )}
        </Box>
      </div>
    );
  },
);

EditVehicleDashboard.displayName = "EditVehicleDashboard";
