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
import { EditUserDashboard } from "../features/manageProfile/pages/EditUserDashboard";
import { IDIRSearchResultsDashboard } from "../features/idir/search/pages/IDIRSearchResultsDashboard";
import { IDIRWelcome } from "../features/idir/IDIRWelcome";
import { UserInfoWizard } from "../features/wizard/UserInfoWizard";
import { VoidPermit } from "../features/permits/pages/Void/VoidPermit";
import { AmendPermit } from "../features/permits/pages/Amend/AmendPermit";
import { Unauthorized } from "../common/pages/Unauthorized";
import { UniversalUnauthorized } from "../common/pages/UniversalUnauthorized";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routes.HOME} element={<InitialLandingPage />} />
      <Route path={routes.CREATE_PROFILE_WIZARD_ROUTES.WELCOME} element={<WelcomePage />} />
      <Route path={routes.ERROR_ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
      <Route path={routes.ERROR_ROUTES.UNIVERSAL_UNAUTHORIZED} element={<UniversalUnauthorized />} />
      <Route path="*" element={<NotFound />} />

      {/* IDIR Routes */}
      <Route element={<ProtectedRoutes requiredRole={ROLES.READ_PERMIT} />}>
        <Route path={routes.IDIR_ROUTES.WELCOME} element={<IDIRWelcome />} />
        <Route
          path={routes.IDIR_ROUTES.SEARCH_RESULTS}
          element={<IDIRSearchResultsDashboard />}
        />
      </Route>

      {/* BCeID Routes */}
      {/* Protected Routes */}
      <Route element={<ProtectedRoutes requiredRole={ROLES.READ_VEHICLE} />}>
        <Route path={routes.VEHICLES_ROUTES.MANAGE}>
          <Route index={true} element={<ManageVehicles />} />
          <Route
            path={`${routes.VEHICLES_ROUTES.POWER_UNIT_DETAILS}/:vehicleId`}
            element={
              <EditVehicleDashboard
                editVehicleMode={VEHICLE_TYPES_ENUM.POWER_UNIT}
              />
            }
          />
          <Route
            path={`${routes.VEHICLES_ROUTES.TRAILER_DETAILS}/:vehicleId`}
            element={
              <EditVehicleDashboard
                editVehicleMode={VEHICLE_TYPES_ENUM.TRAILER}
              />
            }
          />
          <Route
            path={routes.VEHICLES_ROUTES.ADD_POWER_UNIT}
            element={
              <AddVehicleDashboard
                addVehicleMode={VEHICLE_TYPES_ENUM.POWER_UNIT}
              />
            }
          />
          <Route
            path={routes.VEHICLES_ROUTES.ADD_TRAILER}
            element={
              <AddVehicleDashboard
                addVehicleMode={VEHICLE_TYPES_ENUM.TRAILER}
              />
            }
          />
        </Route>
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.READ_ORG} />}>
        <Route path={routes.PROFILE_ROUTES.MANAGE} element={<ManageProfiles />} />
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_USER} />}>
        <Route path={routes.PROFILE_ROUTES.ADD_USER} element={<AddUserDashboard />} />
        <Route path={`${routes.PROFILE_ROUTES.EDIT_USER}/:userGUID`} element={<EditUserDashboard />} />
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route
          path={`${routes.APPLICATIONS_ROUTES.START_APPLICATION}`}
          element={<ManagePermits />}
        />
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route path={routes.APPLICATIONS_ROUTES.BASE} element={<ManageApplications />} />
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route
          path={`${routes.APPLICATIONS_ROUTES.BASE}/:applicationNumber`}
          element={<ManagePermits />}
        />
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route path={routes.APPLICATIONS_ROUTES.BASE}>
          <Route index={true} element={<ManageApplications />} />
          <Route
            path={`${routes.APPLICATIONS_ROUTES.SUCCESS}/:permitId`}
            element={<SuccessPage />}
          />
          <Route
            path={`${routes.APPLICATIONS_ROUTES.FAILURE}/:msg`}
            element={<PaymentFailureRedirect />}
          />
        </Route>
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route 
          path={`${routes.PERMITS_ROUTES.BASE}/:permitId/${routes.PERMITS_ROUTES.VOID}`}
          element={<VoidPermit />} 
        />
        <Route 
          path={`${routes.PERMITS_ROUTES.BASE}/:permitId/${routes.PERMITS_ROUTES.AMEND}`}
          element={<AmendPermit />}
        />
      </Route>
      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route path={routes.PAYMENT_ROUTES.PAYMENT_REDIRECT} element={<PaymentRedirect />} />
      </Route>
      <Route path={routes.CREATE_PROFILE_WIZARD_ROUTES.CREATE} element={<CreateProfileWizard />} />
      <Route path={routes.PROFILE_ROUTES.USER_INFO} element={<UserInfoWizard />} />
    </Routes>
  );
};
