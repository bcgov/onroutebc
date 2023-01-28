import React, { useCallback, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

import "./TabLayout.scss";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ComponentProps {
  label: string;
  component: JSX.Element;
}

interface DashboardProps {
  bannerText: string;
  bannerButton?: JSX.Element;
  componentList: ComponentProps[];
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      className="tabpanel-container"
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

/**
 * The Dashboard component as a common component that includes a Banner, Tabs, and TabPanels.
 *
 * Code for the Tabs is based on the example from MUI Tabs
 * See the 'basic tabs' typescript example here:
 * https://mui.com/material-ui/react-tabs/#basic-tabs
 *
 * @param bannerText - string to display on the banner. (Example: "Profile")
 * @param bannerButton - string to display on the banner. (Example: "Profile")
 * @param componentList - Array of ComponentProps that contain labels (string) and components (JSX.Element)
 * @returns React component containing a dashboard with a Banner, Tabs, and TabPanels.
 */
export const TabLayout = React.memo(
  ({ bannerText, bannerButton, componentList }: DashboardProps) => {
    const [value, setValue] = useState(0);

    const handleChange = useCallback(
      (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
      },
      []
    );

    const DisplayTabs = () => (
      <Tabs value={value} onChange={handleChange} aria-label="profile tabs">
        {componentList.map(({ label }, index) => {
          return (
            <Tab
              key={index}
              label={label}
              {...TabProps(index)}
              sx={{ px: 0, marginRight: "40px" }}
            />
          );
        })}
      </Tabs>
    );

    const DisplayTabPanels = () => (
      <>
        {componentList.map(({ component }, index) => {
          return (
            <TabPanel key={index} value={value} index={index}>
              {component}
            </TabPanel>
          );
        })}
      </>
    );

    const DisplayBanner = () => (
      <div className="dash-banner">
        <h2>{bannerText}</h2>
        {bannerButton ? bannerButton : null}
      </div>
    );

    return (
      <>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            padding: "10px 60px 0px 60px",
          }}
        >
          <DisplayBanner />
          <DisplayTabs />
        </Box>
        <DisplayTabPanels />
      </>
    );
  }
);

TabLayout.displayName = "TabLayout";
