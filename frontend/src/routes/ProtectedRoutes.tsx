import { useAuth } from "react-oidc-context";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import { HOME, UNAUTHORIZED } from "./constants";
import { Loading } from "../common/pages/Loading";
import { useContext, useEffect } from "react";
import OnRouteBCContext from "../common/authentication/OnRouteBCContext";
import { doesUserHaveRoleWithContext } from "../common/authentication/util";
import { LoadUserRolesByCompany } from "../common/authentication/LoadUserRolesByCompanyId";

export const ProtectedRoutes = ({
  requiredRole,
}: {
  requiredRole?: string;
}) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { userRoles } = useContext(OnRouteBCContext);
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Redirect the user back to login page if they are trying to directly access
   * a protected page but are unauthenticated.
   */
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate(HOME);
    }
  }, [isAuthLoading, isAuthenticated]);

  if (isAuthLoading) {
    return <Loading />;
  }

  if (isAuthenticated && !userRoles) {
    return (
      <>
        <LoadUserRolesByCompany />
        <Loading />
      </>
    );
  }

  if (!doesUserHaveRoleWithContext(requiredRole)) {
    return <Navigate to={UNAUTHORIZED} state={{ from: location }} replace />;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={HOME} state={{ from: location }} replace />
  );
};
