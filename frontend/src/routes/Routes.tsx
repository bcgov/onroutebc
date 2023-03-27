import { Routes, Route } from "react-router-dom";
import * as routes from "../constants/routes";

import { HomePage } from "../features/homePage/HomePage";
import { WelcomePage } from "../features/homePage/welcome/WelcomePage";
import { ManageProfiles } from "../features/manageProfile/ManageProfiles";
import { AddVehicleDashboard } from "../features/manageVehicles/components/dashboard/AddVehicleDashboard";
import { VEHICLE_TYPES_ENUM } from "../features/manageVehicles/components/form/constants";
import { ManageVehicles } from "../features/manageVehicles/ManageVehicles";
import { CreateProfileWizard } from "../features/wizard/CreateProfileWizard";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routes.HOME} element={<WelcomePage />} />
      <Route path={routes.MANAGE_VEHICLES}>
        <Route index={true} element={<ManageVehicles />} />
        <Route
          path={routes.ADD_POWER_UNIT}
          element={
            <AddVehicleDashboard
              addVehicleMode={VEHICLE_TYPES_ENUM.POWER_UNIT}
            />
          }
        />
        <Route
          path={routes.ADD_TRAILER}
          element={
            <AddVehicleDashboard addVehicleMode={VEHICLE_TYPES_ENUM.TRAILER} />
          }
        />
      </Route>
      <Route path={routes.MANAGE_PROFILES} element={<ManageProfiles />}></Route>
      <Route
        path={routes.CREATE_PROFILE}
        element={<CreateProfileWizard />}
      ></Route>
    </Routes>
  );
};
