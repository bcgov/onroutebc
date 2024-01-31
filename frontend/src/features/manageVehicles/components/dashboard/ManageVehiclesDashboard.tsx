import { useLocation } from "react-router-dom";
import { memo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { AddVehicleButton } from "./AddVehicleButton";
import { List } from "../list/List";
import "./ManageVehiclesDashboard.scss";
import { getAllPowerUnits, getAllTrailers } from "../../apiManager/vehiclesAPI";
import { DoesUserHaveRoleWithContext } from "../../../../common/authentication/util";
import { ROLES } from "../../../../common/authentication/types";
import { getCompanyIdFromSession } from "../../../../common/apiManager/httpRequestHandler";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { VEHICLES_DASHBOARD_TABS } from "../../../../routes/constants";
import { VEHICLE_TYPES } from "../../types/Vehicle";

/**
 * Returns the selected tab index (if there is one)
 * @returns A number indicating the selected tab. Defaults to 0.
 */
const useTabIndexFromURL = (): number => {
  const { hash: selectedTab } = useLocation();
  switch (selectedTab) {
    case VEHICLES_DASHBOARD_TABS.TRAILER:
      return 1;
    case VEHICLES_DASHBOARD_TABS.VEHICLE_CONFIG:
      return 2;
    case VEHICLES_DASHBOARD_TABS.POWER_UNIT:
    default:
      return 0;
  }
};

/**
 * React component to render the vehicle inventory
 */
export const ManageVehiclesDashboard = memo(() => {
  const staleTime = 5000;
  const companyId = getDefaultRequiredVal("0", getCompanyIdFromSession());

  const powerUnitQuery = useQuery({
    queryKey: ["powerUnits"],
    queryFn: () => getAllPowerUnits(companyId),
    placeholderData: (prev) => keepPreviousData(prev),
    staleTime: staleTime,
  });

  const trailerQuery = useQuery({
    queryKey: ["trailers"],
    queryFn: () => getAllTrailers(companyId),
    placeholderData: (prev) => keepPreviousData(prev),
    staleTime: staleTime,
  });

  const tabs = [
    {
      label: "Power Unit",
      component: (
        <List
          vehicleType={VEHICLE_TYPES.POWER_UNIT}
          query={powerUnitQuery}
          companyId={companyId}
        />
      ),
    },
    {
      label: "Trailer",
      component: (
        <List
          vehicleType={VEHICLE_TYPES.TRAILER}
          query={trailerQuery}
          companyId={companyId}
        />
      ),
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
