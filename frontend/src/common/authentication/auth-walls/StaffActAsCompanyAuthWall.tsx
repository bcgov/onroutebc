import { useContext, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useParams } from "react-router-dom";

import { useCompanyInfoDetailsQuery } from "../../../features/manageProfile/apiManager/hooks";
import { ERROR_ROUTES } from "../../../routes/constants";
import { Loading } from "../../pages/Loading";
import OnRouteBCContext from "../OnRouteBCContext";
import { IDIRUserAuthGroupType, UserRolesType } from "../types";
import { DoesUserHaveRole } from "../util";
import { IDIRAuthWall } from "./IDIRAuthWall";

export const StaffActAsCompanyAuthWall = ({
  requiredRole,
  allowedAuthGroups,
}: {
  requiredRole?: UserRolesType;
  /**
   * The collection of auth groups allowed to have access to a page or action.
   * IDIR System Admin is assumed to be allowed regardless of it being passed.
   * If not provided, only a System Admin will be allowed to access.
   */
  allowedAuthGroups?: IDIRUserAuthGroupType[];
}) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const {
    userRoles,
    companyId: companyIdInContext,
    setCompanyId,
    setCompanyLegalName,
    setOnRouteBCClientNumber,
  } = useContext(OnRouteBCContext);
  const { companyId: companyIdFromUrl } = useParams();

  const { data: companyDetails, isPending: isCompanyDetailLoading } =
    useCompanyInfoDetailsQuery(
      /**
       * If companyId is available in the context,
       * disable the companyInfoDetail query as data already exists.
       * Otherwise, enable the query and data can be loaded through API call.
       */
      companyIdInContext ? null : companyIdFromUrl,
    );

  useEffect(() => {
    if (companyDetails) {
      const { companyId, clientNumber, legalName } = companyDetails;
      setOnRouteBCClientNumber?.(() => clientNumber);
      setCompanyId?.(() => companyId);
      setCompanyLegalName?.(() => legalName);
      sessionStorage.setItem("onRouteBC.user.companyId", companyId.toString());
    }
  }, [isCompanyDetailLoading, companyDetails]);

  if (isAuthLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    if (companyIdInContext || companyDetails?.companyId) {
      return <IDIRAuthWall allowedAuthGroups={allowedAuthGroups} />;
    }

    if (isCompanyDetailLoading) {
      return <Loading />;
    }

    if (!companyIdFromUrl) {
      return <Navigate to={ERROR_ROUTES.UNEXPECTED} replace />;
    }

    if (!DoesUserHaveRole(userRoles, requiredRole)) {
      return <Navigate to={ERROR_ROUTES.UNAUTHORIZED} replace />;
    }
    return <Outlet />;
  }
  return <></>;
};

StaffActAsCompanyAuthWall.displayName = "StaffActAsCompanyWall";
