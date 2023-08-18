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
import { ROLES } from "../common/authentication/types";
import { ManageApplications } from "../features/permits/ManageApplications";
import { SuccessPage } from "../features/permits/pages/SuccessPage/SuccessPage";
import { PaymentRedirect } from "../features/permits/pages/Payment/PaymentRedirect";
import { PaymentFailureRedirect } from "../features/permits/pages/Payment/PaymentFailureRedirect";
import { AddUserDashboard } from "../features/manageProfile/pages/AddUserDashboard";
import { IDIRSearchResultsDashboard } from "../features/idir/search/pages/IDIRSearchResultsDashboard";
import { IDIRWelcome } from "../features/idir/IDIRWelcome";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routes.HOME} element={<InitialLandingPage />} />
      <Route path={routes.WELCOME} element={<WelcomePage />} />
      <Route path="*" element={<NotFound />} />

      {/* IDIR Routes */}
      <Route element={<ProtectedRoutes requiredRole={ROLES.READ_PERMIT} />}>
        <Route path={routes.IDIR_WELCOME} element={<IDIRWelcome />} />
        <Route
          path={routes.SEARCH_RESULTS}
          element={<IDIRSearchResultsDashboard />}
        />
      </Route>

      {/* BCeID Routes */}
      {/* Protected Routes */}
      <Route element={<ProtectedRoutes requiredRole={ROLES.READ_VEHICLE} />}>
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
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.READ_ORG} />}>
        <Route path={routes.MANAGE_PROFILES} element={<ManageProfiles />} />
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_USER} />}>
        <Route path={routes.ADD_USER} element={<AddUserDashboard />} />
        <Route path={routes.EDIT_USER} element={<>Edit User</>} />
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route
          path={`${routes.APPLICATIONS}/${routes.PERMITS}`}
          element={<ManagePermits />}
        />
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route path={routes.APPLICATIONS} element={<ManageApplications />} />
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route
          path={`${routes.APPLICATIONS}/:applicationNumber`}
          element={<ManagePermits />}
        />
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route path={routes.APPLICATIONS}>
          <Route index={true} element={<ManageApplications />} />
          <Route
            path={`${routes.APPLICATIONS_SUCCESS}/:permitId`}
            element={<SuccessPage />}
          />
          <Route
            path={`${routes.APPLICATIONS_FAILURE}/:msg`}
            element={<PaymentFailureRedirect />}
          />
        </Route>
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route path={routes.PAYMENT_REDIRECT} element={<PaymentRedirect />} />
      </Route>
      <Route path={routes.CREATE_PROFILE} element={<CreateProfileWizard />} />
    </Routes>
  );
};
