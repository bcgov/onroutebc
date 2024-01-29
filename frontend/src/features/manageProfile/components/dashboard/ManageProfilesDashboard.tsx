import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { Navigate } from "react-router-dom";

import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { ROLES } from "../../../../common/authentication/types";
import { DoesUserHaveRole } from "../../../../common/authentication/util";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { FIVE_MINUTES } from "../../../../common/constants/constants";
import { ErrorFallback } from "../../../../common/pages/ErrorFallback";
import { Loading } from "../../../../common/pages/Loading";
import { getCompanyInfo } from "../../apiManager/manageProfileAPI";
import { CompanyInfo } from "../../pages/CompanyInfo";
import { MyInfo } from "../../pages/MyInfo";
import { UserManagement } from "../../pages/UserManagement";
import { BCEID_PROFILE_TABS } from "../../types/manageProfile.d";
import { ERROR_ROUTES, PROFILE_ROUTES } from "../../../../routes/constants";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { useAuth } from "react-oidc-context";
import { isIDIR } from "../../../../common/authentication/auth-walls/BCeIDAuthWall";

/**
 * Returns a boolean indicating if the logged in user is a BCeID org admin.
 *
 * @param userRoles The array of roles from the context.
 * @returns A boolean value.
 */
export const isBCeIDOrgAdmin = (userRoles: string[]): boolean => {
  return Boolean(DoesUserHaveRole(userRoles, ROLES.PUBLIC_ORG_ADMIN));
};

export const ManageProfilesDashboard = React.memo(() => {
  const {
    data: companyInfoData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["companyInfo"],
    queryFn: getCompanyInfo,
    keepPreviousData: true,
    staleTime: FIVE_MINUTES,
  });

  const navigate = useNavigate();
  const { userRoles } = useContext(OnRouteBCContext);
  const { user } = useAuth();
  const populatedUserRoles = getDefaultRequiredVal([], userRoles);
  const isBCeIDAdmin =
    isBCeIDOrgAdmin(populatedUserRoles) ||
    isIDIR(user?.profile?.identity_provider as string);

  const { state: stateFromNavigation } = useLocation();
  let selectedTab = BCEID_PROFILE_TABS.COMPANY_INFORMATION;
  if (stateFromNavigation?.selectedTab) {
    selectedTab = stateFromNavigation.selectedTab;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return <Navigate to={ERROR_ROUTES.UNAUTHORIZED} />;
      }
      return <ErrorFallback error={error.message} />;
    }
  }

  const tabs = [
    {
      label: "Company Information",
      component: <CompanyInfo companyInfoData={companyInfoData} />,
    },
  ];

  if (!isIDIR(user?.profile?.identity_provider as string)) {
    tabs.push({
      label: "My Information",
      component: <MyInfo />,
    });
  }

  if (isBCeIDAdmin) {
    tabs.push({
      label: "User Management",
      component: <UserManagement />,
    });
  }

  return (
    <TabLayout
      bannerText="Profile"
      componentList={tabs}
      selectedTabIndex={selectedTab}
      bannerButton={
        isBCeIDAdmin ? (
          <Button
            variant="contained"
            onClick={() => navigate(PROFILE_ROUTES.ADD_USER)}
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
