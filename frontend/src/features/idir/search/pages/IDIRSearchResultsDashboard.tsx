import { Box } from "@mui/material";
import { memo } from "react";
import { useSearchParams } from "react-router-dom";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { IDIRSearchResults } from "../components/IDIRSearchResults";
import { SearchByFilter, SearchEntity, SearchFields } from "../types/types";

const getBannerText = (searchFields: SearchFields): string => {
  if (!searchFields?.searchValue) return "";
  const {
    searchByFilter,
    searchValue,
  } = searchFields;
  if (searchByFilter === SearchByFilter.PERMIT_NUMBER) {
    return `Search Results: Permit # ${searchValue}`;
  }
  return "";
};

/**
 * React component to render the vehicle inventory
 */
export const IDIRSearchResultsDashboard = memo(() => {
  const [searchParams] = useSearchParams();
  const searchpp : SearchFields = {
    searchByFilter: searchParams.get("searchEntity") as SearchByFilter,
    searchEntity: searchParams.get("searchEntity") as SearchEntity,
    searchValue: searchParams.get("searchValue") as string
  }

  return (
    <>
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner bannerText={getBannerText(searchpp)} />
      </Box>
      <div
        className="tabpanel-container"
        role="tabpanel"
        id={`layout-tabpanel-search-results`}
        aria-labelledby={`layout-tab-search-results`}
      >
        <IDIRSearchResults searchParams={searchpp}/>
      </div>
    </>
  );
});

IDIRSearchResultsDashboard.displayName = "IDIRSearchResultsDashboard";