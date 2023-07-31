import { useQuery } from "@tanstack/react-query";
import { TEN_MINUTES } from "../../../../common/constants/constants";
import { getPermits } from "../../apiManager/permitsAPI";
import { BlankPermitList } from "./BlankPermitList";

/**
 * A wrapper with the query to load the table with expired permits.
 */
export const ExpiredPermitList = () => {
  const query = useQuery({
    queryKey: ["expiredPermits"],
    queryFn: () => getPermits({ expired: true }),
    keepPreviousData: true,
    staleTime: TEN_MINUTES,
  });

  return (
    <div className="table-container">
      <BlankPermitList query={query} />
    </div>
  );
};

ExpiredPermitList.displayName = "ExpiredPermitList";
