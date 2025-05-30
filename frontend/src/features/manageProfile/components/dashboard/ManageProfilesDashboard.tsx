import { Button } from "@mui/material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Navigate } from "react-router-dom";
import { useFetchLOAs } from "../../../settings/hooks/LOA";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { CLAIMS } from "../../../../common/authentication/types";
import { DoesUserHaveClaim } from "../../../../common/authentication/util";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { FIVE_MINUTES } from "../../../../common/constants/constants";
import { ErrorFallback } from "../../../../common/pages/ErrorFallback";
import { Loading } from "../../../../common/pages/Loading";
import { getCompanyInfo } from "../../apiManager/manageProfileAPI";
import { CompanyInfo } from "../../pages/CompanyInfo";
import { MyInfo } from "../../pages/MyInfo";
import { UserManagement } from "../../pages/UserManagement";
import { PROFILE_TABS } from "../../types/manageProfile.d";
import { ERROR_ROUTES, PROFILE_ROUTES } from "../../../../routes/constants";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { SpecialAuthorizations } from "../../../settings/pages/SpecialAuthorizations/SpecialAuthorizations";
import { ViewCreditAccount } from "../../../settings/pages/ViewCreditAccount";
import { useGetCreditAccountMetadataQuery } from "../../../settings/hooks/creditAccount";
import { useFeatureFlagsQuery } from "../../../../common/hooks/hooks";
import {
  CREDIT_ACCOUNT_USER_TYPE,
  CreditAccountMetadata,
} from "../../../settings/types/creditAccount";
import { usePermissionMatrix } from "../../../../common/authentication/PermissionMatrix";
import { useFetchSpecialAuthorizations } from "../../../settings/hooks/specialAuthorizations";
import { TabComponentProps } from "../../../../common/components/tabs/types/TabComponentProps";

/**
 * Returns a boolean indicating if the logged in user is a BCeID org admin.
 *
 * @param userClaims The array of claims from the context.
 * @returns A boolean value.
 */
export const isBCeIDOrgAdmin = (userClaims: string[]): boolean => {
  return Boolean(DoesUserHaveClaim(userClaims, CLAIMS.PUBLIC_ORG_ADMIN));
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
    refetchInterval: FIVE_MINUTES,
  });

  const navigate = useNavigate();

  const { companyId: companyIdFromContext, idirUserDetails } =
    useContext(OnRouteBCContext);

  const companyId = getDefaultRequiredVal(0, companyIdFromContext);
  const { data: creditAccountMetadata } =
    useGetCreditAccountMetadataQuery(companyId);
  const { data: featureFlags } = useFeatureFlagsQuery();
  const isStaffActingAsCompany = Boolean(idirUserDetails?.userRole);

  const canViewUserManagementScreen = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_PROFILE",
      permissionMatrixFunctionKey: "VIEW_USER_MANAGEMENT_SCREEN",
    },
  });

  const { data: specialAuthorizations, isPending: isSpecialAuthAPILoading } =
    useFetchSpecialAuthorizations(companyId as number, true);
  const activeLOAsQuery = useFetchLOAs(companyId, false);
  const expiredLOAsQuery = useFetchLOAs(companyId, true);
  const activeLOAs = getDefaultRequiredVal([], activeLOAsQuery.data);
  const expiredLOAs = getDefaultRequiredVal([], expiredLOAsQuery.data);
  const canWriteLOA = usePermissionMatrix({
    featureFlag: "LOA",
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_SETTINGS",
      permissionMatrixFunctionKey: "EDIT_AN_LOA",
    },
  });

  const canViewCompanyInformation = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_PROFILE",
      permissionMatrixFunctionKey: "VIEW_COMPANY_INFORMATION",
    },
  });

  const showSpecialAuth = usePermissionMatrix({
    additionalConditionToCheck: () =>
      !isStaffActingAsCompany &&
      (featureFlags?.["LOA"] === "ENABLED" ||
        featureFlags?.["NO-FEE"] === "ENABLED" ||
        featureFlags?.["LCV"] === "ENABLED") &&
      !isSpecialAuthAPILoading &&
      Boolean(
        specialAuthorizations?.isLcvAllowed ||
          specialAuthorizations?.noFeeType ||
          activeLOAs.length > 0 ||
          expiredLOAs.length > 0 ||
          canWriteLOA,
      ),
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_PROFILE",
      permissionMatrixFunctionKey: "VIEW_SPECIAL_AUTHORIZATIONS",
    },
  });
  const isCreditAccountHolder =
    creditAccountMetadata?.userType === CREDIT_ACCOUNT_USER_TYPE.HOLDER;

  const canViewCreditAccounTabAccountHolder = usePermissionMatrix({
    featureFlag: "CREDIT-ACCOUNT",
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_PROFILE",
      permissionMatrixFunctionKey: "VIEW_CREDIT_ACCOUNT_TAB_ACCOUNT_HOLDER",
    },
    additionalConditionToCheck: () => isCreditAccountHolder,
  });

  const canViewMyInformation = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_PROFILE",
      permissionMatrixFunctionKey: "VIEW_MY_INFORMATION",
    },
  });

  const { state: stateFromNavigation } = useLocation();

  const tabs: TabComponentProps[] = [
    canViewCompanyInformation
      ? {
          label: "Company Information",
          component: <CompanyInfo companyInfoData={companyInfoData} />,
          componentKey: PROFILE_TABS.COMPANY_INFORMATION,
        }
      : null,
    canViewMyInformation
      ? {
          label: "My Information",
          component: <MyInfo />,
          componentKey: PROFILE_TABS.MY_INFORMATION,
        }
      : null,
    canViewUserManagementScreen
      ? {
          label: "Add / Manage Users",
          component: <UserManagement />,
          componentKey: PROFILE_TABS.USER_MANAGEMENT,
        }
      : null,
    showSpecialAuth && companyId
      ? {
          label: "Special Authorizations",
          component: <SpecialAuthorizations companyId={companyId} />,
          componentKey: PROFILE_TABS.SPECIAL_AUTH,
        }
      : null,
    canViewCreditAccounTabAccountHolder
      ? {
          label: "Credit Account",
          component: (
            <ViewCreditAccount
              companyId={companyId}
              creditAccountMetadata={
                creditAccountMetadata as CreditAccountMetadata
              }
              fromTab="MANAGE_PROFILE"
            />
          ),
          componentKey: PROFILE_TABS.CREDIT_ACCOUNT,
        }
      : null,
  ].filter((tab) => Boolean(tab)) as TabComponentProps[];

  const getSelectedTabFromNavigation = (): number => {
    const tabIndex = tabs.findIndex(
      ({ componentKey }) => componentKey === stateFromNavigation?.selectedTab,
    );
    if (tabIndex < 0) return 0;
    return tabIndex;
  };

  const canAddUser = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_PROFILE",
      permissionMatrixFunctionKey: "ADD_USER",
    },
  });

  // Only show "Add User" button for Add / Manage Users tab
  const showAddUserButton = (selectedTabIndex: number) => {
    // Get index of Add / Manage Users tab, if it exists
    const userManagementTabIndex = tabs.findIndex(
      (tab) => tab.componentKey === PROFILE_TABS.USER_MANAGEMENT,
    );

    return (
      canViewUserManagementScreen && selectedTabIndex === userManagementTabIndex
    );
  };

  const initialSelectedTabIndex = getSelectedTabFromNavigation();
  const [shouldShowAddUserButton, setShouldShowAddUserButton] =
    useState<boolean>(showAddUserButton(initialSelectedTabIndex));

  // Set whether or not to show "Add User" button when tab changes
  const handleTabChange = (selectedTabIndex: number) => {
    setShouldShowAddUserButton(showAddUserButton(selectedTabIndex));
  };

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    const isUnauthorized =
      error instanceof AxiosError && error.response?.status == 401;
    return isUnauthorized ? (
      <Navigate to={ERROR_ROUTES.UNAUTHORIZED} />
    ) : (
      <ErrorFallback error={error.message} />
    );
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
            disabled={!canAddUser}
          >
            Add User
          </Button>
        ) : undefined
      }
    />
  );
});

ManageProfilesDashboard.displayName = "ManageProfilesDashboard";
