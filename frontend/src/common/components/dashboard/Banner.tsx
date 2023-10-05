import { ReactNode } from "react";
import { Box, Grid } from "@mui/material";

import "./Banner.scss";

/**
 * The Banner component is a common component that is used to display a banner in a dashboard
 *
 * @param bannerText - string to display on the banner. (Example: "Profile")
 * @param bannerSubtext - subtext to display on the banner. (Example: "Please follow instructions")
 * @param bannerButton - string to display on the banner. (Example: "Profile")
 * @param extendHeight - If the dashboard does NOT use Tabs, then extend the height to match the height of the TabLayout component
 * @returns React component containing a layout for a Banner, Tabs, and TabPanels.
 */
export const Banner = ({
  bannerText,
  bannerSubtext,
  bannerButton,
  extendHeight,
}: {
  bannerText: string;
  bannerSubtext?: string | ReactNode;
  bannerButton?: JSX.Element;
  extendHeight?: boolean;
}) => (
  <div
    className={`layout-banner ${extendHeight ? "layout-banner--extend" : ""}`}
  >
    <Grid container>
      <Grid
        xs={12}
        item
        className="layout-banner__text-section"
      >
        <h2>{bannerText}</h2>
        <Box className="banner-button">
          {bannerButton ? bannerButton : null}
        </Box>
      </Grid>
      <Grid xs item>
        <div className="banner-subtext">
          <div>{bannerSubtext}</div>
        </div>
      </Grid>
    </Grid>
  </div>
);

Banner.displayName = "Banner";
