import { useLocation, useNavigate } from "react-router-dom";

import { useContext } from "react";
import { IDIR_ROUTES } from "../../../routes/constants";
import OnRouteBCContext from "../../authentication/OnRouteBCContext";
import { NavButton } from "./NavButton";
import { NAV_BUTTON_TYPES } from "./types/NavButtonType";
import { useFeatureFlagsQuery } from "../../hooks/hooks";

/**
 * Displays the navigation icon for the Bridge Formula Calculation Tool on the NavIconSideBar
 */
export const NavIconBFCTButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = pathname === IDIR_ROUTES.WELCOME;
  const { clearCompanyContext } = useContext(OnRouteBCContext);

  // Determine when to hide the BridgeFormulaCalculationTool button based on its corresponding feature flag
  const { data: featureFlags } = useFeatureFlagsQuery();
  const enableBFCT =
    featureFlags?.["BRIDGE-FORMULA-CALCULATION-TOOL"] === "ENABLED";

  return enableBFCT ? (
    <NavButton
      type={NAV_BUTTON_TYPES.BFCT}
      onClick={() => {
        clearCompanyContext?.();
        navigate(IDIR_ROUTES.BRIDGE_FORMULA_CALCULATION_TOOL);
      }}
      isActive={isActive}
    />
  ) : null;
};
