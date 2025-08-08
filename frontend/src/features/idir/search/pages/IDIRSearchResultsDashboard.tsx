import { Box } from "@mui/material";
import { memo } from "react";
import { useSearchParams } from "react-router-dom";

import "./IDIRSearchResultsDashboard.scss";
import { Banner } from "../../../../common/components/dashboard/components/banner/Banner";
import { IDIRCompanySearchResults } from "../components/IDIRCompanySearchResults";
import { IDIRPermitSearchResults } from "../components/IDIRPermitSearchResults";
import {
  SEARCH_BY_FILTERS,
  SEARCH_ENTITIES,
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
  if (!searchFields?.searchString) return "";
  const { searchByFilter, searchString } = searchFields;
  if (searchByFilter === SEARCH_BY_FILTERS.PERMIT_NUMBER) {
    return `Search Results: Permit # ${searchString}`;
  }
  if (searchByFilter === SEARCH_BY_FILTERS.VIN) {
    return `Search Results: VIN ${searchString}`;
  }
  if (searchByFilter === SEARCH_BY_FILTERS.COMPANY_NAME) {
    return `Search Results: ${searchString}`;
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
    searchString: searchParams.get("searchString") as string,
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
        <Banner bannerText={getBannerText(searchFields)} />
      </Box>
      <div
        className="idir-search-results-dashboard"
        role="tabpanel"
        id={`layout-tabpanel-search-results`}
        aria-labelledby={`layout-tab-search-results`}
      >
        {searchFields?.searchEntity === SEARCH_ENTITIES.COMPANY && (
          <IDIRCompanySearchResults searchParams={searchFields} />
        )}
        {searchFields?.searchEntity === SEARCH_ENTITIES.PERMIT && (
          <IDIRPermitSearchResults searchParams={searchFields} />
        )}
      </div>
    </>
  );
});

IDIRSearchResultsDashboard.displayName = "IDIRSearchResultsDashboard";
