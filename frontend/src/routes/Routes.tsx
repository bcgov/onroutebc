import { Route, Routes } from "react-router-dom";

import { BCeIDAuthWall } from "../common/authentication/auth-walls/BCeIDAuthWall";
import { IDIRAuthWall } from "../common/authentication/auth-walls/IDIRAuthWall";
import { NewBCeIDAuthWall } from "../common/authentication/auth-walls/NewBCeIDAuthWall";
import { IDIR_USER_AUTH_GROUP, ROLES } from "../common/authentication/types";
import { UniversalUnauthorized } from "../common/pages/UniversalUnauthorized";
import { UniversalUnexpected } from "../common/pages/UniversalUnexpected";
import { InitialLandingPage } from "../features/homePage/InitialLandingPage";
import { WelcomePage } from "../features/homePage/welcome/WelcomePage";
import { IDIRWelcome } from "../features/idir/IDIRWelcome";
import { IDIRReportsDashboard } from "../features/idir/search/pages/IDIRReportsDashboard";
import { IDIRSearchResultsDashboard } from "../features/idir/search/pages/IDIRSearchResultsDashboard";
import { ManageProfiles } from "../features/manageProfile/ManageProfiles";
import { AddUserDashboard } from "../features/manageProfile/pages/AddUserDashboard";
import { EditUserDashboard } from "../features/manageProfile/pages/EditUserDashboard";
import { ManageVehicles } from "../features/manageVehicles/ManageVehicles";
import { AddVehicleDashboard } from "../features/manageVehicles/components/dashboard/AddVehicleDashboard";
import { EditVehicleDashboard } from "../features/manageVehicles/components/dashboard/EditVehicleDashboard";
import { ApplicationSteps } from "../features/permits/ApplicationSteps";
import { PermitDashboard } from "../features/permits/PermitDashboard";
import { AmendPermit } from "../features/permits/pages/Amend/AmendPermit";
import { PaymentRedirect } from "../features/permits/pages/Payment/PaymentRedirect";
import { SuccessPage } from "../features/permits/pages/SuccessPage/SuccessPage";
import { VoidPermit } from "../features/permits/pages/Void/VoidPermit";
import { ChallengeProfileWizard } from "../features/wizard/ChallengeProfileWizard";
import { VEHICLE_TYPES } from "../features/manageVehicles/types/Vehicle";
import { CreateProfileWizard } from "../features/wizard/CreateProfileWizard";
import { UserInfoWizard } from "../features/wizard/UserInfoWizard";
import * as routes from "./constants";
import { IDIRCreateCompany } from "../features/idir/company/IDIRCreateCompany";
import { CompanySuspended } from "../common/pages/CompanySuspended";
import { ManageSettings } from "../features/settings/ManageSettings";
import { Suspend } from "../features/settings/pages/Suspend";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Home and Error Routes */}
      {/* Home and Error routes do no have any constraints. */}
      <Route path={routes.HOME} element={<InitialLandingPage />} />
      <Route
        path={routes.ERROR_ROUTES.SUSPENDED}
        element={<CompanySuspended />}
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

      {/* Wizard Routes */}

      {/* Wizard Routes only require that a user
        * 1) is authenticated
        * 2) is BCeID
        * 3) has no recorded personal info in the system
           - i.e., userDetails object in OnRouteBCContext should be empty/undefined.
      */}
      <Route element={<NewBCeIDAuthWall />}>
        <Route
          path={routes.CREATE_PROFILE_WIZARD_ROUTES.WELCOME}
          element={<WelcomePage />}
        />
        <Route
          path={routes.CREATE_PROFILE_WIZARD_ROUTES.CREATE}
          element={<CreateProfileWizard />}
        />
        <Route
          path={routes.CREATE_PROFILE_WIZARD_ROUTES.MIGRATED_CLIENT}
          element={<ChallengeProfileWizard />}
        />

        <Route
          path={routes.CREATE_PROFILE_WIZARD_ROUTES.USER_INFO}
          element={<UserInfoWizard />}
        />
      </Route>

      {/* IDIR Routes */}
      <Route
        element={
          <IDIRAuthWall
            allowedAuthGroups={[
              IDIR_USER_AUTH_GROUP.ENFORCEMENT_OFFICER,
              IDIR_USER_AUTH_GROUP.PPC_CLERK,
              IDIR_USER_AUTH_GROUP.FINANCE,
              IDIR_USER_AUTH_GROUP.HQ_ADMINISTRATOR,
            ]}
          />
        }
      >
        {/* All IDIR users are allowed access to welcome page */}
        <Route path={routes.IDIR_ROUTES.WELCOME} element={<IDIRWelcome />} />

        {/* All IDIR users are allowed access to search page */}
        <Route
          path={routes.IDIR_ROUTES.SEARCH_RESULTS}
          element={<IDIRSearchResultsDashboard />}
        />
      </Route>

      <Route
        element={
          <IDIRAuthWall allowedAuthGroups={[IDIR_USER_AUTH_GROUP.PPC_CLERK]} />
        }
      >
        <Route
          path={`${routes.PERMITS_ROUTES.VOID()}`}
          element={<VoidPermit />}
        />
        <Route
          path={`${routes.PERMITS_ROUTES.AMEND()}`}
          element={<AmendPermit />}
        />
        <Route
          path={routes.IDIR_ROUTES.CREATE_COMPANY}
          element={<IDIRCreateCompany />}
        />
      </Route>

      {/* IDIR System Admin Routes */}
      <Route
        element={
          <IDIRAuthWall
            allowedAuthGroups={[
              IDIR_USER_AUTH_GROUP.PPC_CLERK,
              IDIR_USER_AUTH_GROUP.FINANCE,
              IDIR_USER_AUTH_GROUP.HQ_ADMINISTRATOR,
            ]}
          />
        }
      >
        {/* Only IDIR System Admins can access the reports page */}
        <Route
          path={routes.IDIR_ROUTES.REPORTS}
          element={<IDIRReportsDashboard />}
        />
      </Route>

      {/* BCeID Routes */}
      {/* Protected Routes */}
      <Route element={<BCeIDAuthWall requiredRole={ROLES.READ_VEHICLE} />}>
        <Route path={routes.VEHICLES_ROUTES.MANAGE}>
          <Route index={true} element={<ManageVehicles />} />
          <Route
            path={`${routes.VEHICLES_ROUTES.POWER_UNIT_DETAILS}/:vehicleId`}
            element={
              <EditVehicleDashboard
                editVehicleMode={VEHICLE_TYPES.POWER_UNIT}
              />
            }
          />
          <Route
            path={`${routes.VEHICLES_ROUTES.TRAILER_DETAILS}/:vehicleId`}
            element={
              <EditVehicleDashboard editVehicleMode={VEHICLE_TYPES.TRAILER} />
            }
          />
          <Route
            path={routes.VEHICLES_ROUTES.ADD_POWER_UNIT}
            element={
              <AddVehicleDashboard addVehicleMode={VEHICLE_TYPES.POWER_UNIT} />
            }
          />
          <Route
            path={routes.VEHICLES_ROUTES.ADD_TRAILER}
            element={
              <AddVehicleDashboard addVehicleMode={VEHICLE_TYPES.TRAILER} />
            }
          />
        </Route>
      </Route>

      <Route element={<BCeIDAuthWall requiredRole={ROLES.READ_ORG} />}>
        <Route
          path={routes.PROFILE_ROUTES.MANAGE}
          element={<ManageProfiles />}
        />
      </Route>

      <Route element={<BCeIDAuthWall requiredRole={ROLES.WRITE_USER} />}>
        <Route
          path={routes.PROFILE_ROUTES.ADD_USER}
          element={<AddUserDashboard />}
        />
        <Route
          path={`${routes.PROFILE_ROUTES.EDIT_USER}/:userGUID`}
          element={<EditUserDashboard />}
        />
      </Route>

      <Route element={<BCeIDAuthWall requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route
          path={`${routes.APPLICATIONS_ROUTES.START_APPLICATION()}`}
          element={
            <ApplicationSteps
              applicationStep={routes.APPLICATION_STEPS.DETAILS}
            />
          }
        />
      </Route>
      <Route element={<BCeIDAuthWall requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route path={routes.APPLICATIONS_ROUTES.BASE}>
          <Route index={true} element={<PermitDashboard />} />
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

      <Route element={<BCeIDAuthWall requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route
          path={`${routes.PERMITS_ROUTES.SUCCESS()}`}
          element={<SuccessPage />}
        />
      </Route>

      <Route element={<BCeIDAuthWall requiredRole={ROLES.WRITE_PERMIT} />}>
        <Route
          path={routes.PAYMENT_ROUTES.PAYMENT_REDIRECT}
          element={<PaymentRedirect />}
        />
      </Route>

      <Route element={
        <IDIRAuthWall 
          allowedAuthGroups={[
            IDIR_USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
            IDIR_USER_AUTH_GROUP.FINANCE,
            IDIR_USER_AUTH_GROUP.ENFORCEMENT_OFFICER,
          ]}
        />
      }>
        <Route
          path={routes.SETTINGS_ROUTES.MANAGE}
          element={<ManageSettings />}
        />
      </Route>

      <Route element={
        <IDIRAuthWall 
          allowedAuthGroups={[
            IDIR_USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
            IDIR_USER_AUTH_GROUP.FINANCE,
            IDIR_USER_AUTH_GROUP.ENFORCEMENT_OFFICER,
          ]}
        />
      }>
        <Route
          path={routes.SETTINGS_ROUTES.SUSPEND}
          element={<Suspend />}
        />
      </Route>
    </Routes>
  );
};
