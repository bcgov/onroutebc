import React, { useCallback, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
// import { VehicleForm } from "../form/VehicleForm";
import { List } from "../list/List";
import { useTranslation } from "react-i18next";
import { PowerUnitForm } from "../form/PowerUnitForm";
import { TrailerForm } from "../form/TrailerForm";

// import SlidingPane from "react-sliding-pane";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
// import "react-sliding-pane/dist/react-sliding-pane.css";

import SlidingPane from "../sliding-pane/react-sliding-pane";
import "../sliding-pane/react-sliding-pane.css";

import { VEHICLE_TYPES_ENUM } from "../form/constants";

import "./Dashboard.scss";
import { AddVehicleButton } from "./AddVehicleButton";

/*
 * The Dashboard component contains the Vehicle Inventory header,
 * Add Vehicle button, Tabs, and the Sliding Panel (which holds the Form component)
 *
 * Code for the Tabs is based on the example from MUI Tabs
 * See the 'basic tabs' typescript example here:
 * https://mui.com/material-ui/react-tabs/#basic-tabs
 *
 */

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export enum Vehicle {
  POWER_UNIT,
  TRAILER,
}

/**
 * Type for displaying snackbar (aka toast message) after an operation.
 */
export interface DisplaySnackBarOptions {
  display: boolean;
  messageI18NKey: string;
  isError: boolean;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dash-tabpanel-${index}`}
      aria-labelledby={`dash-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

const TabProps = (index: number) => {
  return {
    id: `dash-tab-${index}`,
    "aria-controls": `dash-tabpanel-${index}`,
  };
};

export const Dashboard = React.memo(() => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [value, setValue] = useState(0);
  const [addVehicleMode, setAddVehicleMode] =
    useState<VEHICLE_TYPES_ENUM | null>(null);
  const [snackBarStatus, setSnackBarStatus] = useState<DisplaySnackBarOptions>({
    display: true,
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
   * Clears the state of snackbar and closes it.
   */
  const closeSnackBar = useCallback(
    () =>
      setSnackBarStatus({
        display: false,
        isError: false,
        messageI18NKey: "",
      }),
    []
  );

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

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    },
    []
  );

  const { t } = useTranslation();

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          padding: "10px 60px 0px 60px",
        }}
      >
        <div className="dash-banner">
          <h2>{t("vehicle.dashboard.vehicle-inventory")}</h2>
          <AddVehicleButton
            openSlidePanel={openSlidePanel}
            setAddVehicleMode={setAddVehicleMode}
          />
        </div>

        <div>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={snackBarStatus.display}
            onClose={closeSnackBar}
            action={
              <>
                <IconButton
                  aria-label="close"
                  color="inherit"
                  sx={{ p: 0.5 }}
                  onClick={closeSnackBar}
                >
                  <CloseIcon />
                </IconButton>
              </>
            }
            key="manage-vehicle-snackbar"
          >
            <Alert
              onClose={closeSnackBar}
              severity={snackBarStatus.isError ? "error" : "success"}
              sx={{ width: "100%" }}
            >
              {t(snackBarStatus.messageI18NKey)}
            </Alert>
          </Snackbar>
        </div>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="vehicle inventory tabs"
        >
          <Tab label={t("vehicle.power-unit")} {...TabProps(0)} />
          <Tab label={t("vehicle.trailer")} {...TabProps(1)} />
          <Tab label={t("vehicle.vehicle-configuration")} {...TabProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <List />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Todo
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>

      <SlidingPane
        isOpen={showForm}
        onRequestClose={closeSlidePanel}
        from="right"
        width="28%"
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

Dashboard.displayName = "Dashboard";
