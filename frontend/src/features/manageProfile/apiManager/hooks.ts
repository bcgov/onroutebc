import { useQuery } from "@tanstack/react-query";
import { getCompanyInfo } from "./manageProfileAPI";

export const useCompanyInfoQuery = () => {
  return useQuery({
    queryKey: ["companyInfo"],
    queryFn: () => getCompanyInfo("TEST_changeme"),
    retry: false,
  });
};
