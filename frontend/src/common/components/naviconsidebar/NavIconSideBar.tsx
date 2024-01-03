import { useAuth } from "react-oidc-context";
import React, { useContext } from "react";

import { IDPS } from "../../types/idp";
import "./NavIconSideBar.scss";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { USER_AUTH_GROUP } from "../../../features/manageProfile/types/userManagement.d";

interface NavIconSideBarProps {
  children?: React.ReactNode;
}

/**
 * Displays a sidebar with NavIcon buttons as children
 */
export const NavIconSideBar = (props: NavIconSideBarProps) => {
  const { children } = props;
  const { isAuthenticated, user } = useAuth();
  const { idirUserDetails } = useContext(OnRouteBCContext);
  const isIdir = user?.profile?.identity_provider === IDPS.IDIR;
  const isEofficer =
    idirUserDetails?.userAuthGroup === USER_AUTH_GROUP.EOFFICER;

  const shouldShowSideBar =
    isAuthenticated && isIdir && idirUserDetails?.userName && !isEofficer;

  return shouldShowSideBar ? (
    <div className="nav-icon-side-bar">{children}</div>
  ) : null;
};
