import { ReactNode } from "react";
import { Box, Grid } from "@mui/material";

import "./Banner.scss";

/**
 * The Banner component is a common component that is used to display a banner in a dashboard
 *
 * @param bannerText - string to display on the banner. (Example: "Profile")
 * @param bannerSubtext - subtext to display on the banner. (Example: "Please follow instructions")
 * @param bannerButton - string to display on the banner. (Example: "Profile")
 * @param isTabBanner - If the dashboard uses Tabs, then shrink the bottom of the banner to match the height of the TabLayout component
 * @returns React component containing a layout for a Banner, Tabs, and TabPanels.
 */
export const Banner = ({
  bannerText,
  bannerSubtext,
  bannerButton,
  isTabBanner,
}: {
  bannerText: string;
  bannerSubtext?: string | ReactNode;
  bannerButton?: JSX.Element;
  isTabBanner?: boolean;
}) => (
  <div className={`layout-banner ${isTabBanner ? "layout-banner--tab" : ""}`}>
    <Grid container>
      <Grid xs={12} item className="layout-banner__text-section">
        <h2 className="layout-banner__text">{bannerText}</h2>

        {bannerButton ? (
          <Box className="layout-banner__button">{bannerButton}</Box>
        ) : null}
      </Grid>
      <Grid xs item>
        <div className="layout-banner__subtext">
          <div>{bannerSubtext}</div>
        </div>
      </Grid>
    </Grid>
  </div>
);

Banner.displayName = "Banner";
