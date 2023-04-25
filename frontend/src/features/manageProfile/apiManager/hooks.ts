import { useQuery } from "@tanstack/react-query";
import { getCompanyInfo, getUserContext } from "./manageProfileAPI";

export const useCompanyInfoQuery = () => {
  return useQuery({
    queryKey: ["companyInfo"],
    queryFn: getCompanyInfo,
    retry: false,
  });
};

export const useUserContext = () => {
  return useQuery({
    queryKey: ["userContext"],
    queryFn: getUserContext,
    onSuccess: (userContextResponseBody) => {
      console.log(userContextResponseBody);
      sessionStorage.setItem(
        "onroutebc.user.context",
        JSON.stringify(userContextResponseBody)
      );
    },
    retry: false,
  });
};
