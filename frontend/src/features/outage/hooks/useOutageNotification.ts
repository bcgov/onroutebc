
import { useQuery } from "@tanstack/react-query";
import { getOutageNotification } from "../apiManager/outageNotification";

export const useOutageNotification = () => {
  return useQuery({
    queryKey: ["outage-notification"],
    queryFn: getOutageNotification,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,   
  });
};