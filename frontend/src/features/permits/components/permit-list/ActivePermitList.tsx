import { useQuery } from "@tanstack/react-query";
import { InfoBcGovBanner } from "../../../../common/components/banners/AlertBanners";
import { FIVE_MINUTES } from "../../../../common/constants/constants";
import { getPermits } from "../../apiManager/permitsAPI";
import { BasePermitList } from "./BasePermitList";

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
      <InfoBcGovBanner description="Refunds and amendments can be requested over the phone by calling the Provincial Permit Centre at Toll-free: 1-800-559-9688. Please have your permit number ready." />
      <BasePermitList query={query} />
    </div>
  );
};

ActivePermitList.displayName = "ActivePermitList";
