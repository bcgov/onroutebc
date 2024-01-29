import { useLocation, useNavigate } from "react-router-dom";

import { IDIR_ROUTES } from "../../../routes/constants";
import { NavButton } from "./NavButton";
import { NAV_BUTTON_TYPES } from "./types/NavButtonType";
import { useContext } from "react";
import OnRouteBCContext from "../../authentication/OnRouteBCContext";

/**
 * Displays the navigation icon for Home on the NavIconSideBar
 */
export const NavIconHomeButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setCompanyId, setCompanyLegalName, setOnRouteBCClientNumber } =
    useContext(OnRouteBCContext);
  const isActive = pathname === IDIR_ROUTES.WELCOME;

  return (
    <NavButton
      type={NAV_BUTTON_TYPES.HOME}
      onClick={() => {
        setCompanyId?.(() => undefined);
        setCompanyLegalName?.(() => undefined);
        setOnRouteBCClientNumber?.(() => undefined);
        navigate(IDIR_ROUTES.WELCOME);
      }}
      isActive={isActive}
    />
  );
};
