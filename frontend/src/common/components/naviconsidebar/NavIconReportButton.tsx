import { useLocation, useNavigate } from "react-router-dom";

import { IDIR_ROUTES } from "../../../routes/constants";
import { NavButton } from "./NavButton";
import { useClearCompanyContext } from "./helper";
import { NAV_BUTTON_TYPES } from "./types/NavButtonType";

/**
 * Displays the navigation icon for Reports on the NavIconSideBar
 */
export const NavIconReportButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = pathname === IDIR_ROUTES.REPORTS;

  return (
    <NavButton
      type={NAV_BUTTON_TYPES.REPORT}
      onClick={() => {
        useClearCompanyContext();
        navigate(IDIR_ROUTES.REPORTS);
      }}
      isActive={isActive}
    />
  );
};
