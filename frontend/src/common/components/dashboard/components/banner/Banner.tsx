import { ReactNode, useContext } from "react";

import "./Banner.scss";
import { ErrorBcGovBanner } from "../../../banners/ErrorBcGovBanner";
import OnRouteBCContext from "../../../../authentication/OnRouteBCContext";

/**
 * The Banner component is a common component that is used to display a banner in a dashboard
 *
 * @param bannerText - string to display on the banner. (Example: "Profile")
 * @param bannerSubtext - subtext to display on the banner. (Example: "Please follow instructions")
 * @returns React component containing a layout for a Banner, Tabs, and TabPanels.
 */
export const Banner = ({
  bannerText,
  bannerSubtext,
}: {
  bannerText: string;
  bannerSubtext?: string | ReactNode;
}) => {
  const { isCompanySuspended } = useContext(OnRouteBCContext);

  return (
    <div className="layout-banner">
      <div className="layout-banner__left">
        <div className="layout-banner__text-section">
          <h2 className="layout-banner__text">
            {bannerText}
          </h2>

          {bannerSubtext ? (
            <div className="layout-banner__subtext">
              <div>{bannerSubtext}</div>
            </div>
          ): null}
        </div>

        {isCompanySuspended ? (
          <ErrorBcGovBanner
            msg="Company suspended"
            className="layout-banner__suspended"
          />
        ) : null}
      </div>
    </div>
  );
};

Banner.displayName = "Banner";
