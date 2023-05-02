import { Routes, Route } from "react-router-dom";
import * as routes from "./constants";
import { InitialLandingPage } from "../features/homePage/InitialLandingPage";
import { WelcomePage } from "../features/homePage/welcome/WelcomePage";
import { NotFound } from "../common/pages/NotFound";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { ManageProfiles } from "../features/manageProfile/ManageProfiles";
import { ManageVehicles } from "../features/manageVehicles/ManageVehicles";
import { AddVehicleDashboard } from "../features/manageVehicles/components/dashboard/AddVehicleDashboard";
import { EditVehicleDashboard } from "../features/manageVehicles/components/dashboard/EditVehicleDashboard";
import { VEHICLE_TYPES_ENUM } from "../features/manageVehicles/components/form/constants";
import { CreateProfileWizard } from "../features/wizard/CreateProfileWizard";
import { ManagePermits } from "../features/permits/ManagePermits";
import { doesUserHaveRole } from "../common/authentication/util";
import { ROLES } from "../common/authentication/types";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routes.HOME} element={<InitialLandingPage />} />
      <Route path={routes.WELCOME} element={<WelcomePage />} />
      <Route path="*" element={<NotFound />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        {doesUserHaveRole(ROLES.READ_VEHICLE) && (
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
            />
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
        <Route path={routes.MANAGE_PROFILES} element={<ManageProfiles />} />
        <Route path={routes.PERMITS} element={<ManagePermits />} />
        <Route path={routes.CREATE_PROFILE} element={<CreateProfileWizard />} />
      </Route>
    </Routes>
  );
};
