import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import "./ExpiredPermitList.scss";
import { TEN_MINUTES } from "../../../../common/constants/constants";
import { getPermits } from "../../apiManager/permitsAPI";
import { BasePermitList } from "./BasePermitList";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";

/**
 * A wrapper with the query to load the table with expired permits.
 */
export const ExpiredPermitList = ({
  setNumFetchedPermits,
}: {
  setNumFetchedPermits: (numFetchedPermits: number) => void;
}) => {
  const query = useQuery({
    queryKey: ["expiredPermits"],
    queryFn: () => getPermits({ expired: true }),
    keepPreviousData: true,
    staleTime: TEN_MINUTES,
  });

  const numFetchedPermits = getDefaultRequiredVal(0, query.data?.length);

  useEffect(() => {
    setNumFetchedPermits(numFetchedPermits);
  }, [numFetchedPermits]);

  return (
    <div className="table-container">
      <BasePermitList query={query} />
    </div>
  );
};

ExpiredPermitList.displayName = "ExpiredPermitList";
