import { Button } from "@mui/material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

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
import { isIDIR } from "../../../../common/authentication/auth-walls/BCeIDAuthWall";

interface ProfileDashboardTab {
  label: string;
  component: JSX.Element;
  componentKey: string;
}

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
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["companyInfo"],
    queryFn: getCompanyInfo,
    placeholderData: keepPreviousData,
    staleTime: FIVE_MINUTES,
  });

  const navigate = useNavigate();
  const { userRoles } = useContext(OnRouteBCContext);
  const { user } = useAuth();
  const populatedUserRoles = getDefaultRequiredVal([], userRoles);
  const isIDIRUser = isIDIR(user?.profile?.identity_provider as string);
  const isBCeIDAdmin = isBCeIDOrgAdmin(populatedUserRoles);
  const shouldAllowUserManagement = isBCeIDAdmin || isIDIRUser;

  const { state: stateFromNavigation } = useLocation();

  const tabs: ProfileDashboardTab[] = [
    {
      label: "Company Information",
      component: <CompanyInfo companyInfoData={companyInfoData} />,
      componentKey: BCEID_PROFILE_TABS.COMPANY_INFORMATION,
    },
    !isIDIRUser ? {
      label: "My Information",
      component: <MyInfo />,
      componentKey: BCEID_PROFILE_TABS.MY_INFORMATION,
    } : null,
    shouldAllowUserManagement ? {
      label: "User Management",
      component: <UserManagement />,
      componentKey: BCEID_PROFILE_TABS.USER_MANAGEMENT,
    } : null
  ].filter(tab => Boolean(tab)) as ProfileDashboardTab[];

  const getSelectedTabFromNavigation = (): number => {
    const tabIndex = tabs.findIndex(
      ({ componentKey }) => componentKey === stateFromNavigation?.selectedTab,
    );
    if (tabIndex < 0) return 0;
    return tabIndex;
  };

  // Only show "Add User" button for User Management tab
  const showAddUserButton = (selectedTabIndex: number) => {
    // Get index of User Management tab, if it exists
    const userManagementTabIndex = tabs.findIndex(
      tab => tab.componentKey === BCEID_PROFILE_TABS.USER_MANAGEMENT,
    );

    return shouldAllowUserManagement && selectedTabIndex === userManagementTabIndex;
  };

  const initialSelectedTabIndex = getSelectedTabFromNavigation();
  const [shouldShowAddUserButton, setShouldShowAddUserButton] = useState<boolean>(
    showAddUserButton(initialSelectedTabIndex),
  );

  // Set whether or not to show "Add User" button when tab changes
  const handleTabChange = (selectedTabIndex: number) => {
    setShouldShowAddUserButton(
      showAddUserButton(selectedTabIndex),
    );
  };

  if (isPending) {
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

  return (
    <TabLayout
      bannerText="Profile"
      componentList={tabs}
      selectedTabIndex={initialSelectedTabIndex}
      onTabChange={handleTabChange}
      bannerButton={
        shouldShowAddUserButton ? (
          <Button
            variant="contained"
            onClick={() => navigate(PROFILE_ROUTES.ADD_USER)}
            sx={{
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
