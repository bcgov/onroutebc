import React, { useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { Suspend } from "../../pages/Suspend";
import { SETTINGS_TABS, SettingsTab } from "../../types/tabs";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { ERROR_ROUTES } from "../../../../routes/constants";
import { SpecialAuthorizations } from "../../pages/SpecialAuthorizations/SpecialAuthorizations";
import { useFeatureFlagsQuery } from "../../../../common/hooks/hooks";
import {
  canViewSpecialAuthorizations,
  canViewSuspend,
} from "../../helpers/permissions";
import { CreditAccountMetadataComponent } from "../../pages/CreditAccountMetadataComponent";
import { usePermissionMatrix } from "../../../../common/authentication/PermissionMatrix";

export const ManageSettingsDashboard = React.memo(() => {
  const { userRoles, companyId, idirUserDetails } =
    useContext(OnRouteBCContext);

  const { data: featureFlags } = useFeatureFlagsQuery();

  const isStaffActingAsCompany = Boolean(idirUserDetails?.userAuthGroup);

  const [hideSuspendTab, setHideSuspendTab] = useState<boolean>(false);
  const showSuspendTab = canViewSuspend(userRoles) && !hideSuspendTab;
  const showSpecialAuth =
    isStaffActingAsCompany &&
    canViewSpecialAuthorizations(userRoles, idirUserDetails?.userAuthGroup) &&
    featureFlags?.["LOA"] === "ENABLED";

  const showCreditAccountTab = usePermissionMatrix({
    featureFlag: "CREDIT-ACCOUNT",
    permissionMatrixFeatureKey: "MANAGE_SETTINGS",
    permissionMatrixFunctionKey: "VIEW_CREDIT_ACCOUNT_TAB",
  });

  const { state: stateFromNavigation } = useLocation();

  const handleHideSuspendTab = (hide: boolean) => {
    setHideSuspendTab(hide);
  };

  if (!companyId) {
    return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;
  }

  // Add more tabs here later when needed (eg. "Credit Account")
  const tabs = [
    showSpecialAuth
      ? {
          label: "Special Authorizations",
          component: <SpecialAuthorizations companyId={companyId} />,
          componentKey: SETTINGS_TABS.SPECIAL_AUTH,
        }
      : null,
    showCreditAccountTab
      ? {
          label: "Credit Account",
          component: <CreditAccountMetadataComponent companyId={companyId} />,
          componentKey: SETTINGS_TABS.CREDIT_ACCOUNT,
        }
      : null,
    showSuspendTab
      ? {
          label: "Suspend",
          component: (
            <Suspend companyId={companyId} hideTab={handleHideSuspendTab} />
          ),
          componentKey: SETTINGS_TABS.SUSPEND,
        }
      : null,
  ].filter((tab) => Boolean(tab)) as {
    label: string;
    component: JSX.Element;
    componentKey: SettingsTab;
  }[];

  const getSelectedTabFromNavigation = (): number => {
    const tabIndex = tabs.findIndex(
      ({ componentKey }) => componentKey === stateFromNavigation?.selectedTab,
    );
    if (tabIndex < 0) return 0;
    return tabIndex;
  };

  const selectedTab = getSelectedTabFromNavigation();

  return (
    <TabLayout
      bannerText="Settings"
      componentList={tabs}
      selectedTabIndex={selectedTab}
    />
  );
});

ManageSettingsDashboard.displayName = "ManageSettingsDashboard";
