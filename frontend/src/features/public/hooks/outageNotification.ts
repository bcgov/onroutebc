
import { useQuery } from "@tanstack/react-query";
import { getOutageNotification } from "../apiManager/outageNotification";

export const useOutageNotificationQuery = () => {
  return useQuery({
    queryKey: ["outageNotification"],
    queryFn: getOutageNotification,
    retry: false,
    refetchOnWindowFocus: false,
  });
};