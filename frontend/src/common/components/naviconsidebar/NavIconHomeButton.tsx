import { useLocation, useNavigate } from "react-router-dom";

import { IDIR_ROUTES } from "../../../routes/constants";
import { NavButton } from "./NavButton";
import { NAV_BUTTON_TYPES } from "./types/NavButtonType";

/**
 * Displays the navigation icon for Home on the NavIconSideBar
 */
export const NavIconHomeButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = pathname === IDIR_ROUTES.WELCOME;

  return (
    <NavButton
      type={NAV_BUTTON_TYPES.HOME}
      onClick={() => navigate(IDIR_ROUTES.WELCOME)}
      isActive={isActive}
    />
  );
};
