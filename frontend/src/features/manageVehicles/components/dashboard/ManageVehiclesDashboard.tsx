import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { AddVehicleButton } from "./AddVehicleButton";

import { List } from "../list/List";

import "./ManageVehiclesDashboard.scss";
import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPowerUnits, getAllTrailers } from "../../apiManager/vehiclesAPI";
import { DoesUserHaveRoleWithContext } from "../../../../common/authentication/util";
import { ROLES } from "../../../../common/authentication/types";
import { useLocation } from "react-router-dom";

/**
 * Returns the selected tab index (if there is one)
 * @param vehicleType The vehicle type
 * @returns A number indicating the selected tab. Defaults to 0.
 */
const useTabIndexFromURL = (): number => {
  const { hash: selectedTab } = useLocation();
  switch (selectedTab) {
    case "#power-unit":
      return 0;
    case "#trailer":
      return 1;
    case "#vehicle-configuration":
      return 2;
    default:
      return 0;
  }
};

/**
 * React component to render the vehicle inventory
 */
export const ManageVehiclesDashboard = memo(() => {
  const keepPreviousData = true;
  const staleTime = 5000;

  const powerUnitQuery = useQuery({
    queryKey: ["powerUnits"],
    queryFn: getAllPowerUnits,
    keepPreviousData: keepPreviousData,
    staleTime: staleTime,
  });

  const trailerQuery = useQuery({
    queryKey: ["trailers"],
    queryFn: getAllTrailers,
    keepPreviousData: keepPreviousData,
    staleTime: staleTime,
  });

  const tabs = [
    {
      label: "Power Unit",
      component: <List vehicleType="powerUnit" query={powerUnitQuery} />,
    },
    {
      label: "Trailer",
      component: <List vehicleType="trailer" query={trailerQuery} />,
    },
    {
      label: "Vehicle Configuration",
      component: <>TODO</>,
    },
  ];

  return (
    <TabLayout
      bannerText="Vehicle Inventory"
      selectedTabIndex={useTabIndexFromURL()}
      bannerButton={
        DoesUserHaveRoleWithContext(ROLES.WRITE_VEHICLE) ? (
          <AddVehicleButton />
        ) : undefined
      }
      componentList={tabs}
    />
  );
});

ManageVehiclesDashboard.displayName = "ManageVehiclesDashboard";
