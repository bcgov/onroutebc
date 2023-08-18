import { memo } from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { SearchByFilter, SearchFields } from "../types/types";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { IDIRSearchResults } from "../components/IDIRSearchResults";

const getBannerText = ({
  searchByFilter,
  searchValue,
}: SearchFields): string => {
  if (searchByFilter === SearchByFilter.PERMIT_NUMBER) {
    return `Search Results: Permit # ${searchValue}`;
  }
  return "";
};

/**
 * React component to render the vehicle inventory
 */
export const IDIRSearchResultsDashboard = memo(() => {
  const { state: stateFromNavigation } = useLocation();
  return (
    <>
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner bannerText={getBannerText(stateFromNavigation)} />
      </Box>
      <div
        className="tabpanel-container"
        role="tabpanel"
        id={`layout-tabpanel-search-results`}
        aria-labelledby={`layout-tab-search-results`}
      >
        <IDIRSearchResults />
      </div>
    </>
  );
});

IDIRSearchResultsDashboard.displayName = "IDIRSearchResultsDashboard";