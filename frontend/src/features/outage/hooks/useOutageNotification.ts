
import { useQuery } from "@tanstack/react-query";
import { getOutageNotification } from "../apiManager/outageNotification";
import { THIRTY_MINUTES } from "../../../common/constants/constants";

export const useOutageNotification = () => {
  return useQuery({
    queryKey: ["outage-notification"],
    queryFn: getOutageNotification,
    staleTime: THIRTY_MINUTES,
    refetchOnWindowFocus: false,
    retry: false,   
  });
};