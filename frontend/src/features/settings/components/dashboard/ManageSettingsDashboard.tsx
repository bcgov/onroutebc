import React, { useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { Suspend } from "../../pages/Suspend";
import { SETTINGS_TABS } from "../../types/tabs";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { ERROR_ROUTES } from "../../../../routes/constants";
import { canViewSpecialAuthorizations, canViewSuspend } from "../../helpers/permissions";
import { SpecialAuthorizations } from "../../pages/SpecialAuthorizations/SpecialAuthorizations";

export const ManageSettingsDashboard = React.memo(() => {
  const { userRoles, companyId } = useContext(OnRouteBCContext);
  const [hideSuspendTab, setHideSuspendTab] = useState<boolean>(false);
  const showSuspendTab = canViewSuspend(userRoles) && !hideSuspendTab;
  const showSpecialAuth = canViewSpecialAuthorizations(userRoles);

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