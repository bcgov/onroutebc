import { Routes, Route } from "react-router-dom";

import * as routes from "./constants";
import { InitialLandingPage } from "../features/homePage/InitialLandingPage";
import { WelcomePage } from "../features/homePage/welcome/WelcomePage";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { ManageProfiles } from "../features/manageProfile/ManageProfiles";
import { ManageVehicles } from "../features/manageVehicles/ManageVehicles";
import { AddVehicleDashboard } from "../features/manageVehicles/components/dashboard/AddVehicleDashboard";
import { EditVehicleDashboard } from "../features/manageVehicles/components/dashboard/EditVehicleDashboard";
import { VEHICLE_TYPES_ENUM } from "../features/manageVehicles/components/form/constants";
import { CreateProfileWizard } from "../features/wizard/CreateProfileWizard";
import { ApplicationSteps } from "../features/permits/ApplicationSteps";
import { ROLES } from "../common/authentication/types";
import { PermitDashboard } from "../features/permits/PermitDashboard";
import { SuccessPage } from "../features/permits/pages/SuccessPage/SuccessPage";
import { PaymentRedirect } from "../features/permits/pages/Payment/PaymentRedirect";
import { AddUserDashboard } from "../features/manageProfile/pages/AddUserDashboard";
import { EditUserDashboard } from "../features/manageProfile/pages/EditUserDashboard";
import { IDIRSearchResultsDashboard } from "../features/idir/search/pages/IDIRSearchResultsDashboard";
import { IDIRWelcome } from "../features/idir/IDIRWelcome";
import { UserInfoWizard } from "../features/wizard/UserInfoWizard";
import { VoidPermit } from "../features/permits/pages/Void/VoidPermit";
import { IDIRReportsDashboard } from "../features/idir/search/pages/IDIRReportsDashboard";
import { AmendPermit } from "../features/permits/pages/Amend/AmendPermit";
import { UniversalUnauthorized } from "../common/pages/UniversalUnauthorized";
import { UniversalUnexpected } from "../common/pages/UniversalUnexpected";
import { ChallengeProfileWizard } from "../features/wizard/ChallengeProfileWizard";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Home and Error Routes */}
      <Route path={routes.HOME} element={<InitialLandingPage />} />
      <Route
        path={routes.CREATE_PROFILE_WIZARD_ROUTES.WELCOME}
        element={<WelcomePage />}
      />
      <Route
        path={routes.ERROR_ROUTES.UNAUTHORIZED}
        element={<UniversalUnauthorized />}
      />
      <Route
        path={routes.ERROR_ROUTES.UNEXPECTED}
        element={<UniversalUnexpected />}
      />
      <Route path="*" element={<UniversalUnexpected />} />

      {/* IDIR Routes */}
      <Route element={<ProtectedRoutes requiredRole={ROLES.READ_PERMIT} />}>
        <Route path={routes.IDIR_ROUTES.WELCOME} element={<IDIRWelcome />} />
        <Route
          path={routes.IDIR_ROUTES.SEARCH_RESULTS}
          element={<IDIRSearchResultsDashboard />}
        />
        <Route
          path={routes.IDIR_ROUTES.REPORTS}
          element={<IDIRReportsDashboard />}
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
        <Route
          path={routes.PROFILE_ROUTES.MANAGE}
          element={<ManageProfiles />}
        />
      </Route>

      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_USER} />}>
        <Route
          path={routes.PROFILE_ROUTES.ADD_USER}
          element={<AddUserDashboard />}
        />
        <Route
          path={`${routes.PROFILE_ROUTES.EDIT_USER}/:userGUID`}
          element={<EditUserDashboard />}
        />
      </Route>

      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route path={routes.APPLICATIONS_ROUTES.BASE}>
          <Route index={true} element={<PermitDashboard />} />
          <Route
            path={`${routes.APPLICATIONS_ROUTES.START_APPLICATION}`}
            element={
              <ApplicationSteps
                applicationStep={routes.APPLICATION_STEPS.DETAILS}
              />
            }
          />
          <Route path={`${routes.APPLICATIONS_ROUTES.DETAILS()}`}>
            <Route
              index={true}
              element={
                <ApplicationSteps
                  applicationStep={routes.APPLICATION_STEPS.DETAILS}
                />
              }
            />
            <Route
              path={routes.APPLICATIONS_ROUTES.REVIEW()}
              element={
                <ApplicationSteps
                  applicationStep={routes.APPLICATION_STEPS.REVIEW}
                />
              }
            />
            <Route
              path={routes.APPLICATIONS_ROUTES.PAY()}
              element={
                <ApplicationSteps
                  applicationStep={routes.APPLICATION_STEPS.PAY}
                />
              }
            />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route
          path={`${routes.PERMITS_ROUTES.VOID()}`}
          element={<VoidPermit />}
        />
        <Route
          path={`${routes.PERMITS_ROUTES.AMEND()}`}
          element={<AmendPermit />}
        />
        <Route
          path={`${routes.PERMITS_ROUTES.SUCCESS()}`}
          element={<SuccessPage />}
        />
      </Route>

      <Route element={<ProtectedRoutes requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route
          path={routes.PAYMENT_ROUTES.PAYMENT_REDIRECT}
          element={<PaymentRedirect />}
        />
      </Route>

      <Route
        path={routes.CREATE_PROFILE_WIZARD_ROUTES.CREATE}
        element={<CreateProfileWizard />}
      />
      <Route
        path={routes.CREATE_PROFILE_WIZARD_ROUTES.MIGRATED_CLIENT}
        element={<ChallengeProfileWizard />}
      />

      <Route
        path={routes.PROFILE_ROUTES.USER_INFO}
        element={<UserInfoWizard />}
      />
    </Routes>
  );
};
