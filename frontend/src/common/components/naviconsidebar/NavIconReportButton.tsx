import { useNavigate } from "react-router-dom";

import * as routes from "../../../routes/constants";
import { NavButton } from "./NavButton";

/**
 * Displays the navigation icon for Reports on the NavIconSideBar
 */
export const NavIconReportButton = () => {
  const navigate = useNavigate();

  return (
    <NavButton
      type="report"
      onClick={() => navigate(routes.IDIR_WELCOME)}
    />
  );
}