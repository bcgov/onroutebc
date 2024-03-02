import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { Suspend } from "../../pages/Suspend";
import { SETTINGS_TABS } from "../../types/tabs";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { DoesUserHaveAuthGroup } from "../../../../common/authentication/util";
import { IDIR_USER_AUTH_GROUP } from "../../../../common/authentication/types";
import { ERROR_ROUTES } from "../../../../routes/constants";

export const ManageSettingsDashboard = React.memo(() => {
  const { idirUserDetails, companyId } = useContext(OnRouteBCContext);
  const allowSettingsDashboard = Boolean(
    DoesUserHaveAuthGroup({
      userAuthGroup: idirUserDetails?.userAuthGroup,
      allowedAuthGroups: [
        IDIR_USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
        IDIR_USER_AUTH_GROUP.FINANCE,
        IDIR_USER_AUTH_GROUP.ENFORCEMENT_OFFICER,
      ],
    })
  );
  const showSuspendTab = allowSettingsDashboard;

  const { state: stateFromNavigation } = useLocation();
  const selectedTab = getDefaultRequiredVal(
    SETTINGS_TABS.SUSPEND,
    stateFromNavigation?.selectedTab,
  );

  if (!companyId) {
    return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;
  }

  const tabs = [
    showSuspendTab ? {
      label: "Suspend",
      component: <Suspend companyId={companyId} />,
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