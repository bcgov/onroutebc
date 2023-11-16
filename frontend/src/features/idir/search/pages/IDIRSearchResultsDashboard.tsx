import { Box } from "@mui/material";
import { memo } from "react";
import { useSearchParams } from "react-router-dom";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { IDIRSearchResults } from "../components/IDIRSearchResults";
import {
  SEARCH_BY_FILTERS,
  SearchByFilter,
  SearchEntity,
  SearchFields,
} from "../types/types";

/**
 * Returns a banner text based on the search criteria.
 * @param searchFields The search parameters.
 * @returns Empty string or an appropriate banner text.
 */
const getBannerText = (searchFields: SearchFields): string => {
  if (!searchFields?.searchValue) return "";
  const { searchByFilter, searchValue } = searchFields;
  if (searchByFilter === SEARCH_BY_FILTERS.PERMIT_NUMBER) {
    return `Search Results: Permit # ${searchValue}`;
  }
  return "";
};

/**
 * React component to render the search results by an IDIR user.
 */
export const IDIRSearchResultsDashboard = memo(() => {
  const [searchParams] = useSearchParams();
  const searchFields: SearchFields = {
    searchByFilter: searchParams.get("searchByFilter") as SearchByFilter,
    searchEntity: searchParams.get("searchEntity") as SearchEntity,
    searchValue: searchParams.get("searchValue") as string,
  };

  return (
    <>
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner 
          bannerText={getBannerText(searchFields)} 
          extendHeight={true} 
        />
      </Box>
      <div
        className="tabpanel-container"
        role="tabpanel"
        id={`layout-tabpanel-search-results`}
        aria-labelledby={`layout-tab-search-results`}
      >
        <IDIRSearchResults searchParams={searchFields} />
      </div>
    </>
  );
});

IDIRSearchResultsDashboard.displayName = "IDIRSearchResultsDashboard";
