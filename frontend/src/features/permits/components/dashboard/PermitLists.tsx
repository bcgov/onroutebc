import React, { useContext, useState } from "react";

import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { StartApplicationAction } from "../../pages/Application/components/dashboard/StartApplicationAction";
import { ActivePermitList } from "../permit-list/ActivePermitList";
import { ExpiredPermitList } from "../permit-list/ExpiredPermitList";
import { ApplicationsInProgressList } from "../permit-list/ApplicationsInProgressList";
import { Nullable } from "../../../../common/types/common";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { IDIR_USER_AUTH_GROUP } from "../../../../common/authentication/types";
import { isIDIR } from "../../../../common/authentication/auth-walls/BCeIDAuthWall";
import { useAuth } from "react-oidc-context";

export const PermitLists = React.memo(() => {
  const [applicationsInProgressCount, setApplicationsInProgressCount] =
    useState<Nullable<number>>();
  const { user } = useAuth();
  const handleApplicationsCountChange = (count: number) => {
    setApplicationsInProgressCount(count);
  };
  const { idirUserDetails } = useContext(OnRouteBCContext);
  const tabs = [];
  if (
    isIDIR(user?.profile?.identity_provider as string) &&
    idirUserDetails &&
    idirUserDetails.userAuthGroup !== IDIR_USER_AUTH_GROUP.FINANCE
  ) {
    tabs.push({
      label: "Applications in Progress",
      count: applicationsInProgressCount,
      component: (
        <ApplicationsInProgressList
          onCountChange={handleApplicationsCountChange}
        />
      ),
    });
  }
  tabs.push(
    {
      label: "Active Permits",
      component: <ActivePermitList />,
    },
    {
      label: "Expired Permits",
      component: <ExpiredPermitList />,
    },
  );

  return (
    <TabLayout
      bannerText="Permits"
      bannerButton={<StartApplicationAction />}
      componentList={tabs}
    />
  );
});

PermitLists.displayName = "PermitLists";
