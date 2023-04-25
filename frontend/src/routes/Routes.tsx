import { Routes, Route } from "react-router-dom";
import * as routes from "./routeConstants";
import { useAuth } from "react-oidc-context";

import { InitialLandingPage } from "../features/homePage/InitialLandingPage";
import { WelcomePage } from "../features/homePage/welcome/WelcomePage";
import { ManageProfiles } from "../features/manageProfile/ManageProfiles";
import { AddVehicleDashboard } from "../features/manageVehicles/components/dashboard/AddVehicleDashboard";
import { VEHICLE_TYPES_ENUM } from "../features/manageVehicles/components/form/constants";
import { ManageVehicles } from "../features/manageVehicles/ManageVehicles";
import { CreateProfileWizard } from "../features/wizard/CreateProfileWizard";
import { ApplicationDashboard } from "../features/permits/components/dashboard/ApplicationDashboard";
import { EditVehicleDashboard } from "../features/manageVehicles/components/dashboard/EditVehicleDashboard";
import { NotFound } from "../common/pages/NotFound";

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path={routes.HOME} element={<InitialLandingPage />} />
      <Route path={routes.WELCOME} element={<WelcomePage />} />
      {isAuthenticated && (
        <Route path={routes.MANAGE_VEHICLES}>
          <Route index={true} element={<ManageVehicles />} />
          <Route
            path="power-units/:vehicleId"
            element={
              <EditVehicleDashboard
                editVehicleMode={VEHICLE_TYPES_ENUM.POWER_UNIT}
              />
            }
          />
          <Route
            path="trailers/:vehicleId"
            element={
              <EditVehicleDashboard
                editVehicleMode={VEHICLE_TYPES_ENUM.TRAILER}
              />
            }
          />
          <Route
            path={routes.ADD_POWER_UNIT}
            element={
              <AddVehicleDashboard
                addVehicleMode={VEHICLE_TYPES_ENUM.POWER_UNIT}
              />
            }
          ></Route>
          <Route
            path={routes.ADD_TRAILER}
            element={
              <AddVehicleDashboard
                addVehicleMode={VEHICLE_TYPES_ENUM.TRAILER}
              />
            }
          />
        </Route>
      )}

      {isAuthenticated && (
        <Route
          path={routes.MANAGE_PROFILES}
          element={<ManageProfiles />}
        ></Route>
      )}

      {isAuthenticated && (
        <Route path={routes.PERMITS} element={<ApplicationDashboard />} />
      )}

      {isAuthenticated && (
        <Route
          path={routes.CREATE_PROFILE}
          element={<CreateProfileWizard />}
        ></Route>
      )}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
