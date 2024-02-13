import { useLocation, useNavigate } from "react-router-dom";

import { useContext } from "react";
import { IDIR_ROUTES } from "../../../routes/constants";
import OnRouteBCContext from "../../authentication/OnRouteBCContext";
import { NavButton } from "./NavButton";
import { NAV_BUTTON_TYPES } from "./types/NavButtonType";

/**
 * Displays the navigation icon for Reports on the NavIconSideBar
 */
export const NavIconReportButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = pathname === IDIR_ROUTES.REPORTS;
  const { setCompanyId, setCompanyLegalName, setOnRouteBCClientNumber } =
    useContext(OnRouteBCContext);

  return (
    <NavButton
      type={NAV_BUTTON_TYPES.REPORT}
      onClick={() => {
        setCompanyId?.(() => undefined);
        setCompanyLegalName?.(() => undefined);
        setOnRouteBCClientNumber?.(() => undefined);
        sessionStorage.removeItem("onRouteBC.user.companyId");
        navigate(IDIR_ROUTES.REPORTS);
      }}
      isActive={isActive}
    />
  );
};
