import { Button } from "@mui/material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
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

  const tabs: [
    {
      label: string;
      component: JSX.Element;
      componentKey: string;
    },
  ] = [
    {
      label: "Company Information",
      component: <CompanyInfo companyInfoData={companyInfoData} />,
      componentKey: BCEID_PROFILE_TABS.COMPANY_INFORMATION,
    },
  ];

  if (!isIDIRUser) {
    tabs.push({
      label: "My Information",
      component: <MyInfo />,
      componentKey: BCEID_PROFILE_TABS.MY_INFORMATION,
    });
  }

  if (shouldAllowUserManagement) {
    tabs.push({
      label: "User Management",
      component: <UserManagement />,
      componentKey: BCEID_PROFILE_TABS.USER_MANAGEMENT,
    });
  }

  const getSelectedTab = (): number => {
    const tabIndex = tabs.findIndex(
      ({ componentKey }) => componentKey === stateFromNavigation?.selectedTab,
    );
    if (tabIndex < 0) return 0;
    return tabIndex;
  };

  return (
    <TabLayout
      bannerText="Profile"
      componentList={tabs}
      selectedTabIndex={getSelectedTab()}
      bannerButton={
        shouldAllowUserManagement ? (
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
