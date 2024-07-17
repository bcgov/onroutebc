import React, { useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { Suspend } from "../../pages/Suspend";
import { CreditAccount } from "../../pages/CreditAccount";
import { SETTINGS_TABS } from "../../types/tabs";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { ERROR_ROUTES } from "../../../../routes/constants";
import { SpecialAuthorizations } from "../../pages/SpecialAuthorizations/SpecialAuthorizations";
import { useFeatureFlagsQuery } from "../../../../common/hooks/hooks";
import {
  canViewSpecialAuthorizations,
  canViewSuspend,
  canViewCreditAccountTab,
} from "../../helpers/permissions";

export const ManageSettingsDashboard = React.memo(() => {
  const {
    userRoles,
    companyId,
    idirUserDetails,
  } = useContext(OnRouteBCContext);

  const { data: featureFlags } = useFeatureFlagsQuery();

  const isStaffActingAsCompany = Boolean(idirUserDetails?.userAuthGroup);

  const [hideSuspendTab, setHideSuspendTab] = useState<boolean>(false);
  const showSuspendTab = canViewSuspend(userRoles) && !hideSuspendTab;
  const showSpecialAuth = isStaffActingAsCompany && canViewSpecialAuthorizations(
    userRoles,
    idirUserDetails?.userAuthGroup,
  );

  const showCreditAccountTab =
    canViewCreditAccountTab(userRoles) &&
    featureFlags?.["CREDIT-ACCOUNT"] === "ENABLED";

  const { state: stateFromNavigation } = useLocation();
  const selectedTab = getDefaultRequiredVal(
    SETTINGS_TABS.SPECIAL_AUTH,
    stateFromNavigation?.selectedTab,
  );

  const handleHideSuspendTab = (hide: boolean) => {
    setHideSuspendTab(hide);
  };

  if (!companyId) {
    return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;
  }

  // Add more tabs here later when needed (eg. "Credit Account")
  const tabs = [
    showSpecialAuth ? {
      label: "Special Authorizations",
      component: (
        <SpecialAuthorizations
          companyId={companyId}
        />
      ),
    } : null,
    showCreditAccountTab ? {
      label: "Credit Account",
      component: <CreditAccount companyId={companyId} />,
    } : null,
    showSuspendTab ? {
      label: "Suspend",
      component: (
        <Suspend
          companyId={companyId}
          hideTab={handleHideSuspendTab}
        />
      ),
    } : null,
  ].filter(tab => Boolean(tab)) as {
    label: string;
    component: JSX.Element;
  }[];

  return (
    <TabLayout
      bannerText="Settings"
      componentList={tabs}
      selectedTabIndex={selectedTab}
    />
  );
});

ManageSettingsDashboard.displayName = "ManageSettingsDashboard";
