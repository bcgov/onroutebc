import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { AddVehicleButton } from "./AddVehicleButton";

import { List } from "../list/List";

import "./ManageVehiclesDashboard.scss";
import { memo } from "react";

/**
 * React component to render the vehicle inventory
 */
export const ManageVehiclesDashboard = memo(() => {
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

  return (
    <TabLayout
      bannerText="Vehicle Inventory"
      bannerButton={<AddVehicleButton />}
      componentList={tabs}
    />
  );
});

ManageVehiclesDashboard.displayName = "ManageVehiclesDashboard";
