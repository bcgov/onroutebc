import { useAuth } from "react-oidc-context";
import { useContext } from "react";

import { IDPS } from "../../types/idp";
import "./NavIconSideBar.scss";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { NavIconHomeButton } from "./NavIconHomeButton";
import { NavIconReportButton } from "./NavIconReportButton";
import { NavIconBFCTButton } from "./NavIconBFCTButton";
import { useFeatureFlagsQuery } from "../../hooks/hooks";
import { usePermissionMatrix } from "../../authentication/PermissionMatrix";

/**
 * Displays a sidebar with NavIcon buttons as children
 */
export const NavIconSideBar = () => {
  const { isAuthenticated, user } = useAuth();
  const { idirUserDetails } = useContext(OnRouteBCContext);
  const isIdir = user?.profile?.identity_provider === IDPS.IDIR;

  const shouldShowSideBar =
    isAuthenticated && isIdir && idirUserDetails?.userName;

  // Determine when to hide the BridgeFormulaCalculationTool button based on its corresponding feature flag
  const { data: featureFlags } = useFeatureFlagsQuery();

  const BFCTFeatureFlagEnabled =
    featureFlags?.["BRIDGE-FORMULA-CALCULATION-TOOL"] === "ENABLED";

  const shouldShowBFCTButton = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "STICKY_SIDE_BAR",
      permissionMatrixFunctionKey: "BRIDGE_FORMULA_CALCULATION_TOOL_BUTTON",
    },
  });

  const shouldShowReportsButton = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "STICKY_SIDE_BAR",
      permissionMatrixFunctionKey: "REPORTS_BUTTON",
    },
  });

  return shouldShowSideBar ? (
    <div className="nav-icon-side-bar">
      <NavIconHomeButton />
      {shouldShowReportsButton && <NavIconReportButton />}
      {BFCTFeatureFlagEnabled && shouldShowBFCTButton && <NavIconBFCTButton />}
    </div>
  ) : null;
};
