import { useLocation, useNavigate } from "react-router-dom";

import { useContext } from "react";
import { IDIR_ROUTES } from "../../../routes/constants";
import OnRouteBCContext from "../../authentication/OnRouteBCContext";
import { NavButton } from "./NavButton";
import { NAV_BUTTON_TYPES } from "./types/NavButtonType";
import { usePermissionMatrix } from "../../authentication/PermissionMatrix";

/**
 * Displays the navigation icon for Home on the NavIconSideBar
 */
export const NavIconHomeButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = pathname === IDIR_ROUTES.WELCOME;
  const { clearCompanyContext } = useContext(OnRouteBCContext);

  const canViewApplicationQueue = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "STAFF_HOME_SCREEN",
      permissionMatrixFunctionKey: "VIEW_QUEUE",
    },
  });

  return (
    <NavButton
      type={NAV_BUTTON_TYPES.HOME}
      onClick={() => {
        clearCompanyContext?.();
        navigate(
          canViewApplicationQueue
            ? IDIR_ROUTES.STAFF_HOME
            : IDIR_ROUTES.WELCOME,
        );
      }}
      isActive={isActive}
    />
  );
};
