import React, { useCallback, useState } from "react";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { VEHICLE_TYPES_ENUM } from "../form/constants";
import { PowerUnitForm } from "../form/PowerUnitForm";
import { TrailerForm } from "../form/TrailerForm";
import { AddVehicleButton } from "./AddVehicleButton";

import SlidingPane from "../sliding-pane/react-sliding-pane";
import "../sliding-pane/react-sliding-pane.css";
import { List } from "../list/List";

import "./ManageVehiclesDashboard.scss";
import { t } from "i18next";
import {
  CustomSnackbar2,
  DisplaySnackBarOptions,
} from "../../../../common/components/snackbar/CustomSnackbar2";

/**
 * React component to render the vehicle inventory
 */
export const ManageVehiclesDashboard = React.memo(() => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [addVehicleMode, setAddVehicleMode] =
    useState<VEHICLE_TYPES_ENUM | null>(null);

  const tabs = [
    {
      label: "Power Unit",
      component: <List />,
    },
    {
      label: "Trailer",
      component: <>TODO</>,
    },
    {
      label: "Vehicle Configuration",
      component: <>TODO</>,
    },
  ];

  const [snackBarStatus, setSnackBarStatus] = useState<DisplaySnackBarOptions>({
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
  const displaySnackBar = useCallback(function (
    options: DisplaySnackBarOptions
  ) {
    const { messageI18NKey: message, isError, display } = options;
    setSnackBarStatus(() => {
      return {
        messageI18NKey: message,
        isError: isError,
        display: display,
      };
    });
  },
  []);

  /**
   * Closes the slide panel
   */
  const closeSlidePanel = useCallback(function () {
    setShowForm(false);
    setAddVehicleMode(null);
  }, []);

  /**
   * Opens the slide panel
   */
  const openSlidePanel = useCallback(function (
    vehicleMode: VEHICLE_TYPES_ENUM
  ) {
    setShowForm(true);
    setAddVehicleMode(vehicleMode);
  },
  []);

  return (
    <>
      <TabLayout
        bannerText="Vehicle Inventory"
        bannerButton={<AddVehicleButton openSlidePanel={openSlidePanel} />}
        componentList={tabs}
      />

      <CustomSnackbar2
        snackBarStatus={snackBarStatus}
        setSnackBarStatus={setSnackBarStatus}
      />

      <SlidingPane
        isOpen={showForm}
        onRequestClose={closeSlidePanel}
        from="right"
        width="538px"
        title={
          addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT
            ? t("vehicle.add-vehicle.power-unit")
            : t("vehicle.add-vehicle.trailer")
        }
        closeIcon="X"
      >
        {addVehicleMode === VEHICLE_TYPES_ENUM.POWER_UNIT && (
          <PowerUnitForm
            displaySnackBar={displaySnackBar}
            closeSlidePanel={closeSlidePanel}
          />
        )}
        {addVehicleMode === VEHICLE_TYPES_ENUM.TRAILER && <TrailerForm />}
      </SlidingPane>
    </>
  );
});

ManageVehiclesDashboard.displayName = "ManageVehiclesDashboard";
