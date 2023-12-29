import { Route } from "react-router-dom";
import { IDIR_USER_AUTH_GROUP, ROLES } from "../common/authentication/types";
import { IDIRProtectedRoutes } from "./IDIRProtectedRoutes";
import * as routes from "./constants";
import { IDIRSearchResultsDashboard } from "../features/idir/search/pages/IDIRSearchResultsDashboard";
import { IDIRReportsDashboard } from "../features/idir/search/pages/IDIRReportsDashboard";
import { IDIRWelcome } from "../features/idir/IDIRWelcome";

/**
 * All the IDIR routes for navigation and their protection rules.
 */
export const IDIRRoutes = () => {
  return (
    <>
      <Route
        element={
          <IDIRProtectedRoutes
            requiredRole={ROLES.STAFF}
            allowedAuthGroups={[
              IDIR_USER_AUTH_GROUP.ENFORCEMENT_OFFICER,
              IDIR_USER_AUTH_GROUP.PPC_CLERK,
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

      {/* IDIR System Admin Routes */}
      <Route element={<IDIRProtectedRoutes requiredRole={ROLES.STAFF_ADMIN} />}>
        {/* Only IDIR System Admins can access the reports page */}
        <Route
          path={routes.IDIR_ROUTES.REPORTS}
          element={<IDIRReportsDashboard />}
        />
      </Route>
    </>
  );
};
