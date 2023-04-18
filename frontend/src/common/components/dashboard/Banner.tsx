import { Box, Grid, Typography } from "@mui/material";
import "./Dashboard.scss";
import { ReactNode } from "react";

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
    className="layout-banner"
    style={extendHeight ? { paddingBottom: "39px", paddingTop: "39px" } : {}}
  >
    <Grid container>
      <Grid
        xs={12}
        item
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <h2>{bannerText}</h2>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {bannerButton ? bannerButton : null}
        </Box>
      </Grid>
      <Grid xs item>
        <div className="banner-subtext">
          <Typography>{bannerSubtext}</Typography>
        </div>
      </Grid>
    </Grid>
  </div>
);

Banner.displayName = "Banner";
