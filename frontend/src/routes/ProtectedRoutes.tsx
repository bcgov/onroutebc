import { useAuth } from "react-oidc-context";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import { HOME, UNAUTHORIZED } from "./constants";
import { Loading } from "../common/pages/Loading";
import { useContext, useEffect } from "react";
import OnRouteBCContext from "../common/authentication/OnRouteBCContext";
import { DoesUserHaveRole } from "../common/authentication/util";
import { LoadBCeIDUserRolesByCompany } from "../common/authentication/LoadBCeIDUserRolesByCompany";
import { LoadBCeIDUserContext } from "../common/authentication/LoadBCeIDUserContext";
import { LoadIDIRUserContext } from "../common/authentication/LoadIDIRUserContext";
import { LoadIDIRUserRoles } from "../common/authentication/LoadIDIRUserRoles";

const isIDIR = (identityProvider: string) => identityProvider === "idir";

export const ProtectedRoutes = ({
  requiredRole,
}: {
  requiredRole?: string;
}) => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    user: userFromToken,
  } = useAuth();
  const { userRoles, companyId, idirUserDetails } =
    useContext(OnRouteBCContext);
  const userIDP = userFromToken?.profile?.identity_provider as string;
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

  if (isAuthenticated) {
    if (isIDIR(userIDP) && !idirUserDetails?.userAuthGroup) {
      return (
        <>
          <LoadIDIRUserContext />
          <LoadIDIRUserRoles />
        </>
      );
    }
    if (!isIDIR(userIDP)) {
      if (!companyId) {
        return (
          <>
            <LoadBCeIDUserContext />
            <Loading />
          </>
        );
      }
      if (!userRoles) {
        return (
          <>
            <LoadBCeIDUserRolesByCompany />
            <Loading />
          </>
        );
      }
    }

    if (!DoesUserHaveRole(userRoles, requiredRole)) {
      return <Navigate to={UNAUTHORIZED} state={{ from: location }} replace />;
    }
    return <Outlet />;
  } else {
    return <Navigate to={HOME} state={{ from: location }} replace />;
  }
};
