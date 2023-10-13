import { SEARCH_RESULTS } from "../../../../../routes/constants";
import { SEARCH_BY_FILTERS, SEARCH_ENTITIES } from "../../../../idir/search/types/types";

const searchRoute = `${SEARCH_RESULTS}?searchEntity=${SEARCH_ENTITIES.PERMIT}`
  + `&searchByFilter=${SEARCH_BY_FILTERS.PERMIT_NUMBER}`;

export const AmendPermitFinish = () => {
  return (
    <div>
      Amend Permit Finish
    </div>
  );
};
