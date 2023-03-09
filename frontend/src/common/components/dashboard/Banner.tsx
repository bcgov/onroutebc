import "./Dashboard.scss";

/**
 * The Banner component is a common component that is used to display a banner in a dashboard
 *
 * @param bannerText - string to display on the banner. (Example: "Profile")
 * @param bannerButton - string to display on the banner. (Example: "Profile")
 * @param extendHeight - If the dashboard does NOT use Tabs, then extend the height to match the height of the TabLayout component
 * @returns React component containing a layout for a Banner, Tabs, and TabPanels.
 */
export const Banner = ({
  bannerText,
  bannerButton,
  extendHeight,
}: {
  bannerText: string;
  bannerButton?: JSX.Element;
  extendHeight?: boolean;
}) => (
  <div
    className="layout-banner"
    style={extendHeight ? { paddingBottom: "39px", paddingTop: "39px" } : {}}
  >
    <h2>{bannerText}</h2>
    {bannerButton ? bannerButton : null}
  </div>
);

Banner.displayName = "Banner";
