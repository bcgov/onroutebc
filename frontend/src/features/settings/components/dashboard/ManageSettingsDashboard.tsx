import React, { useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { Suspend } from "../../pages/Suspend";
import { CreditAccount } from "../../pages/CreditAccount";
import { SETTINGS_TABS } from "../../types/tabs";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { ERROR_ROUTES } from "../../../../routes/constants";
import {
  canViewSuspend,
  canViewCreditAccount,
} from "../../helpers/permissions";

export const ManageSettingsDashboard = React.memo(() => {
  const { userRoles, companyId } = useContext(OnRouteBCContext);

  const [hideSuspendTab, setHideSuspendTab] = useState<boolean>(false);
  const showSuspendTab = canViewSuspend(userRoles) && !hideSuspendTab;

  const [hideCreditAccountTab, setHideCreditAccountTab] =
    useState<boolean>(false);
  const showCreditAccountTab =
    canViewCreditAccount(userRoles) && !hideCreditAccountTab;

  const { state: stateFromNavigation } = useLocation();
  const selectedTab = getDefaultRequiredVal(
    SETTINGS_TABS.SUSPEND,
    stateFromNavigation?.selectedTab,
  );

  const handleHideSuspendTab = (hide: boolean) => {
    setHideSuspendTab(hide);
  };

  const handleHideCreditAccountTab = (hide: boolean) => {
    setHideCreditAccountTab(hide);
  };

  if (!companyId) {
    return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;
  }

  // Add more tabs here later when needed (eg. "Special Authorization", "Credit Account")
  const tabs = [
    showCreditAccountTab
      ? {
          label: "Credit Account",
          component: (
            <CreditAccount
              companyId={companyId}
              hideTab={handleHideCreditAccountTab}
            />
          ),
        }
      : null,
    showSuspendTab
      ? {
          label: "Suspend",
          component: (
            <Suspend companyId={companyId} hideTab={handleHideSuspendTab} />
          ),
        }
      : null,
  ].filter((tab) => Boolean(tab)) as {
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
