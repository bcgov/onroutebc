import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { AddVehicleButton } from "./AddVehicleButton";

import { List } from "../list/List";

import "./ManageVehiclesDashboard.scss";
import { memo, useState } from "react";
import { AddVehicleDashboard } from "./AddVehicleDashboard";
import { VEHICLE_TYPES_ENUM } from "../form/constants";

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

  const [showAddVehicle, setShowAddVehicle] = useState({
    showAddVehicle: false,
    vehicleType: VEHICLE_TYPES_ENUM.NONE,
  });

  return (
    <>
      {!showAddVehicle.showAddVehicle ? (
        <TabLayout
          bannerText="Vehicle Inventory"
          bannerButton={
            <AddVehicleButton setShowAddVehicle={setShowAddVehicle} />
          }
          componentList={tabs}
        />
      ) : (
        <AddVehicleDashboard
          addVehicleMode={showAddVehicle.vehicleType}
          setShowAddVehicle={setShowAddVehicle}
        />
      )}
    </>
  );
});

ManageVehiclesDashboard.displayName = "ManageVehiclesDashboard";
