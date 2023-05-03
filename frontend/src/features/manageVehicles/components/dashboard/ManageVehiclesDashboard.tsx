import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { AddVehicleButton } from "./AddVehicleButton";

import { List } from "../list/List";

import "./ManageVehiclesDashboard.scss";
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPowerUnits, getAllTrailers } from "../../apiManager/vehiclesAPI";
import { doesUserHaveRoleWithContext } from "../../../../common/authentication/util";
import { ROLES } from "../../../../common/authentication/types";

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
      bannerButton={
        doesUserHaveRoleWithContext(ROLES.WRITE_VEHICLE) ? (
          <AddVehicleButton />
        ) : undefined
      }
      componentList={tabs}
    />
  );
});

ManageVehiclesDashboard.displayName = "ManageVehiclesDashboard";
