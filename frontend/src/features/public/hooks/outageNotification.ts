
import { useQuery } from "@tanstack/react-query";
import { getOutageNotification } from "../apiManager/outageNotification";

export const useOutageNotificationQuery = () => {
  return useQuery({
    queryKey: ["outage-notification"],
    queryFn: async () => {
      try {
        return await getOutageNotification();
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return null;
        }
        throw error; 
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};