import React, { useCallback, useState } from "react";
import { VEHICLE_TYPES_ENUM } from "../form/constants";
import { PowerUnitForm } from "../form/PowerUnitForm";
import { TrailerForm } from "../form/TrailerForm";

import {
  CustomSnackbar2,
  DisplaySnackBarOptions,
} from "../../../../common/components/snackbar/CustomSnackbar2";
import { Box, Typography } from "@mui/material";

import "../../../../common/components/dashboard/Dashboard.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";

export const AddVehicleDashboard = React.memo(
  ({
    addVehicleMode,
    setShowAddVehicle,
  }: {
    addVehicleMode: VEHICLE_TYPES_ENUM;
    setShowAddVehicle: React.Dispatch<
      React.SetStateAction<{
        showAddVehicle: boolean;
        vehicleType: VEHICLE_TYPES_ENUM;
      }>
    >;
  }) => {
    const [snackBarStatus, setSnackBarStatus] =
      useState<DisplaySnackBarOptions>({
        display: false,
        messageI18NKey: "",
        isError: false,
      });

    /**
     * Displays a snackbar.
     * @param display - boolean indicating if the snackbar should be displayed.
     * @param isError - boolean indicating if the snackbar expresses an error.
     * @param messageI18NKey - string containing the i8n message key.
     */
    const displaySnackBar = useCallback(
      function (options: DisplaySnackBarOptions) {
        const { messageI18NKey: message, isError, display } = options;
        setSnackBarStatus(() => {
          return {
            messageI18NKey: message,
            isError: isError,
            display: display,
          };
        });
      },
      [snackBarStatus]
    );

    const handleShowAddVehicle = () => {
      setShowAddVehicle({
        showAddVehicle: false,
        vehicleType: VEHICLE_TYPES_ENUM.NONE,
      });
    };

    return (
      <>
        <CustomSnackbar2
          snackBarStatus={snackBarStatus}
          setSnackBarStatus={setSnackBarStatus}
        />
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
          <i
            className="fa fa-chevron-right"
            style={{ marginLeft: "8px", marginRight: "8px" }}
          ></i>
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
          <i
            className="fa fa-chevron-right"
            style={{ marginLeft: "8px", marginRight: "8px" }}
          ></i>
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
            paddingTop: "4px",
            backgroundColor: BC_COLOURS.white,
          }}
        >
          <Typography
            variant={"h2"}
            sx={{
              marginRight: "162px",
              marginTop: "0px",
              paddingTop: "0px",
            }}
          >
            {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT &&
              "Power Unit Details"}
            {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && "Trailer Details"}
          </Typography>
          {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT && (
            <PowerUnitForm
              displaySnackBar={displaySnackBar}
              setShowAddVehicle={setShowAddVehicle}
            />
          )}
          {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && <TrailerForm />}
        </Box>
      </>
    );
  }
);

AddVehicleDashboard.displayName = "AddVehicleDashboard";
