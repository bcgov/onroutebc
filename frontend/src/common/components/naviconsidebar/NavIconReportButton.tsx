import { useNavigate } from "react-router-dom";

import * as routes from "../../../routes/constants";
import { NavButton } from "./NavButton";
import { NAV_BUTTON_TYPES } from "./types/NavButtonType";

/**
 * Displays the navigation icon for Reports on the NavIconSideBar
 */
export const NavIconReportButton = () => {
  const navigate = useNavigate();

  return (
    <NavButton
      type={NAV_BUTTON_TYPES.REPORT}
      onClick={() => navigate(routes.IDIR_WELCOME)}
    />
  );
}