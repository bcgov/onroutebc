import React, { useCallback, useState } from "react";
import { Button, Box, Tabs, Tab } from "@mui/material";
// import { VehicleForm } from "../form/VehicleForm";
import { List } from "../list/List";
import { useTranslation } from "react-i18next";
import { PowerUnitForm } from "../form/PowerUnitForm";
import { TrailerForm } from "../form/TrailerForm";

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

import "./Dashboard.scss";

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

enum Vehicle {
  POWER_UNIT,
  TRAILER,
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
  const [addVehicleMode, setAddVehicleMode] = useState<Vehicle | null>(null);

  /**
   * Closes the slide panel
   */
  const closeSlidePanel = useCallback(function () {
    setShowForm(false);
    setAddVehicleMode(null);
  }, []);

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
          <h2>{t('vehicle.dashboard.vehicle-inventory')}</h2>
          <Button
            variant="contained"
            onClick={useCallback(() => setShowForm(true), [])}
          >
            Add Vehicle <i className="fa fa-chevron-down dash-downarrow"></i>
          </Button>
        </div>

        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="vehicle inventory tabs"
        >
          <Tab label={t('vehicle.power-unit')} {...TabProps(0)} />
          <Tab label={t('vehicle.trailer')} {...TabProps(1)} />
          <Tab label={t('vehicle.vehicle-configuration')} {...TabProps(2)} />
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
        title={t("add-vehicle.power-unit")}
        hideHeader={true}
      >
        {/* <VehicleForm /> */}
        {addVehicleMode === Vehicle.POWER_UNIT && <PowerUnitForm />}
        {addVehicleMode === Vehicle.TRAILER && <TrailerForm />}
      </SlidingPane>
    </>
  );
});

Dashboard.displayName = "Dashboard";
