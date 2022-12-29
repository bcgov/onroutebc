import React, { useState } from "react";
import { Button } from "@mui/material";
import { VehicleForm } from "../form/VehicleForm";
import { List } from "../list/List";

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { Box, Tabs, Tab } from "@mui/material";

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
          <h2>Vehicle Inventory</h2>
          <Button variant="contained" onClick={() => setShowForm(true)}>
            Add Vehicle <i className="fa fa-chevron-down dash-downarrow"></i>
          </Button>
        </div>

        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="vehicle inventory tabs"
        >
          <Tab label="Power Unit" {...TabProps(0)} />
          <Tab label="Trailer" {...TabProps(1)} />
          <Tab label="Vehicle Configuration" {...TabProps(2)} />
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
        onRequestClose={() => setShowForm(false)}
        from="right"
        width="40%"
        hideHeader={true}
      >
        <VehicleForm />
      </SlidingPane>
    </>
  );
});

Dashboard.displayName = "Dashboard";
