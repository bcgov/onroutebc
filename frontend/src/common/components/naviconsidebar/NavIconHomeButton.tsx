import { useNavigate } from "react-router-dom";

import * as routes from "../../../routes/constants";
import { NavButton } from "./NavButton";
import { NAV_BUTTON_TYPES } from "./types/NavButtonType";

/**
 * Displays the navigation icon for Home on the NavIconSideBar
 */
export const NavIconHomeButton = () => {
  const navigate = useNavigate();

  return (
    <NavButton
      type={NAV_BUTTON_TYPES.HOME}
      onClick={() => navigate(routes.IDIR_WELCOME)}
    />
  );
};
