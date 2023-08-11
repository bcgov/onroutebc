import React from "react";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { CompanyInfo } from "../../pages/CompanyInfo";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Unauthorized } from "../../../../common/pages/Unauthorized";
import { getCompanyInfo } from "../../apiManager/manageProfileAPI";
import { Loading } from "../../../../common/pages/Loading";
import { ErrorFallback } from "../../../../common/pages/ErrorFallback";
import { MyInfo } from "../../pages/MyInfo";
import { UserManagement } from "../../pages/UserManagement";
import { DoesUserHaveRoleWithContext } from "../../../../common/authentication/util";
import { ROLES } from "../../../../common/authentication/types";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";

/**
 * Returns a boolean indicating if the logged in user is a CV Client Admin.
 * @returns A boolean value.
 */
const isCVClientAdmin = (): boolean => {
  return Boolean(
    DoesUserHaveRoleWithContext(ROLES.PUBLIC_USER_ADMIN) ||
      DoesUserHaveRoleWithContext(ROLES.PUBLIC_ORG_ADMIN)
  );
};

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

  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return <Unauthorized />;
      }
      return <ErrorFallback error={error.message} />;
    }
  }

  const tabs = [
    {
      label: "Company Information",
      component: <CompanyInfo companyInfoData={companyInfoData} />,
    },
    {
      label: "My Information",
      component: <MyInfo />,
    },
  ];

  if (isCVClientAdmin()) {
    tabs.push({
      label: "User Management",
      component: <UserManagement />,
    });
  }

  tabs.push({
    label: "Payment Information",
    component: <>TODO</>,
  });

  return (
    <TabLayout
      bannerText="Profile"
      componentList={tabs}
      bannerButton={
        isCVClientAdmin() ? (
          <Button
            variant="contained"
            onClick={() => navigate('/add-user')}
            sx={{
              marginTop: "45px",
              height: "50px",
            }}
          >
            Add User
          </Button>
        ) : undefined
      }
    />
  );
});

ManageProfilesDashboard.displayName = "ManageProfilesDashboard";
