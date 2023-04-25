import React from "react";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { CompanyInfo } from "../../pages/CompanyInfo";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Unauthorized } from "../../../../common/pages/Unauthorized";
import { getCompanyInfo } from "../../apiManager/manageProfileAPI";
import { Loading } from "../../../../common/pages/Loading";
import { UnexpectedError } from "../../../../common/pages/UnexpectedError";

export const ManageProfilesDashboard = React.memo(() => {
  const {
    data: companyInfoData,
    isLoading,
    isError,
    error,
    //refetch,
  } = useQuery({
    queryKey: ["companyInfo"],
    queryFn: getCompanyInfo,
    keepPreviousData: true,
    staleTime: 5000,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return <Unauthorized />;
      }
      return <UnexpectedError error={error.message} />;
    }
  }

  const tabs = [
    {
      label: "Company Information",
      component: <CompanyInfo companyInfoData={companyInfoData} />,
    },
    {
      label: "My Information",
      component: <>TODO</>,
    },
    {
      label: "User Management",
      component: <>TODO</>,
    },
    {
      label: "Payment Information",
      component: <>TODO</>,
    },
  ];

  return <TabLayout bannerText="Profile" componentList={tabs} />;
});

ManageProfilesDashboard.displayName = "ManageProfilesDashboard";
