import { useLocation, useNavigate } from "react-router-dom";

import { useContext } from "react";
import { IDIR_ROUTES } from "../../../routes/constants";
import OnRouteBCContext from "../../authentication/OnRouteBCContext";
import { NavButton } from "./NavButton";
import { NAV_BUTTON_TYPES } from "./types/NavButtonType";
import { isStaffUser } from "../../../features/idir/staff/helpers/isStaffUser";

/**
 * Displays the navigation icon for Home on the NavIconSideBar
 */
export const NavIconHomeButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = pathname === IDIR_ROUTES.WELCOME;
  const { clearCompanyContext, idirUserDetails } = useContext(OnRouteBCContext);

  return (
    <NavButton
      type={NAV_BUTTON_TYPES.HOME}
      onClick={() => {
        clearCompanyContext?.();
        navigate(
          isStaffUser(idirUserDetails?.userRole)
            ? IDIR_ROUTES.STAFF_HOME
            : IDIR_ROUTES.WELCOME,
        );
      }}
      isActive={isActive}
    />
  );
};
