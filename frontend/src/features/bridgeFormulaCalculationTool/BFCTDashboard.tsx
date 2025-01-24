/* eslint-disable @typescript-eslint/no-unused-vars */
import { Banner } from "../../common/components/dashboard/components/banner/Banner";
import {
  getNavButtonTitle,
  NAV_BUTTON_TYPES,
} from "../../common/components/naviconsidebar/types/NavButtonType";
import { Box } from "@mui/material";
import { InfoBcGovBanner } from "../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../common/constants/bannerMessages";
import "./BFCTDashboard.scss";
import { BridgeFormulaCalculationTool } from "./components/BridgeFormulaCalculationTool";
import { BFCT } from "./components/BFCT";

export const BFCTDashboard = () => {
  return (
    <>
      <Box className="layout-box">
        <Banner bannerText={getNavButtonTitle(NAV_BUTTON_TYPES.BFCT)} />
      </Box>
      <div
        className="bfct-dashboard"
        role="tabpanel"
        id={"bfct-dashboard"}
        aria-labelledby={"bfct-dashboard"}
      >
        <div className="bfct-dashboard__split">
          <InfoBcGovBanner
            className="bfct-dashboard__info-banner"
            msg={BANNER_MESSAGES.BRIDGE_FORMULA_CALCULATION_TOOL}
          />
          <InfoBcGovBanner
            className="bfct-dashboard__info-banner"
            msg={BANNER_MESSAGES.BRIDGE_FORMULA_CALCULATION_TOOL}
          />
        </div>
        <BridgeFormulaCalculationTool />
        {/* <BFCT /> */}
      </div>
    </>
  );
};

BFCTDashboard.displayName = "BridgeFormulaCalculationToolDashboard";
