import { useQuery } from "@tanstack/react-query";

import "./ActivePermitList.scss";
import { InfoBcGovBanner } from "../../../../common/components/banners/InfoBcGovBanner";
import { FIVE_MINUTES } from "../../../../common/constants/constants";
import { getPermits } from "../../apiManager/permitsAPI";
import { BasePermitList } from "./BasePermitList";
import { BANNER_MESSAGES } from "../../../../common/constants/bannerMessages";

/**
 * A wrapper with the query to load the table with active permits.
 */
export const ActivePermitList = () => {
  const query = useQuery({
    queryKey: ["activePermits"],
    queryFn: () => getPermits(),
    keepPreviousData: true,
    staleTime: FIVE_MINUTES,
  });

  return (
    <div className="table-container">
      <InfoBcGovBanner
        msg={BANNER_MESSAGES.PERMIT_REFUND_REQUEST} 
      />
      <BasePermitList query={query} />
    </div>
  );
};

ActivePermitList.displayName = "ActivePermitList";
