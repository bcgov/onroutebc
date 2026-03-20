import React, { useState } from "react";

import { TabComponentProps } from "../tabs/types/TabComponentProps";
import { TabBanner } from "./components/banner/TabBanner";
import { DashboardTabPanels } from "./DashboardTabPanels";

interface TabLayoutProps {
  bannerText: string;
  bannerButton?: JSX.Element;
  componentList: TabComponentProps[];
  selectedTabIndex?: number;
  onTabChange?: (tabIndex: number) => void;
}

/**
 * The TabLayout component is a common component that includes a Banner, Tabs, and TabPanels.
 *
 * Code for the Tabs is based on the example from MUI Tabs
 * See the 'basic tabs' typescript example here:
 * https://mui.com/material-ui/react-tabs/#basic-tabs
 *
 * @param bannerText - string to display on the banner. (Example: "Profile")
 * @param bannerButton - string to display on the banner. (Example: "Profile")
 * @param componentList - Array of ComponentProps that contain labels (string) and components (JSX.Element)
 * @param selectedTabIndex - The tab to be displayed instead of a default one. Defaults to zero.
 * @returns React component containing a layout for a Banner, Tabs, and TabPanels.
 */
export const TabLayout = React.memo(
  ({
    bannerText,
    bannerButton,
    componentList,
    selectedTabIndex = 0,
    onTabChange,
  }: TabLayoutProps) => {
    const [selectedTab, setSelectedTab] = useState<number>(selectedTabIndex);

    const handleChange = (_: React.SyntheticEvent, newTabIndex: number) => {
      setSelectedTab(newTabIndex);
      onTabChange?.(newTabIndex);
    };

    return (
      <>
        <TabBanner
          bannerText={bannerText}
          bannerButton={bannerButton}
          componentList={componentList}
          tabIndex={selectedTab}
          onTabChange={handleChange}
        />

        <DashboardTabPanels value={selectedTab} componentList={componentList} />
      </>
    );
  },
);

TabLayout.displayName = "TabLayout";
