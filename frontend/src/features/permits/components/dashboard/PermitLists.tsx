import React, { useContext, useState } from "react";

import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import {
  IDIR_USER_AUTH_GROUP,
  ROLES,
} from "../../../../common/authentication/types";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { RenderIf } from "../../../../common/components/reusable/RenderIf";
import { Nullable } from "../../../../common/types/common";
import { StartApplicationAction } from "../../pages/Application/components/dashboard/StartApplicationAction";
import { ActivePermitList } from "../permit-list/ActivePermitList";
import { ApplicationsInProgressList } from "../permit-list/ApplicationsInProgressList";
import { ExpiredPermitList } from "../permit-list/ExpiredPermitList";

export const PermitLists = React.memo(() => {
  const [applicationsInProgressCount, setApplicationsInProgressCount] =
    useState<Nullable<number>>();
  const handleApplicationsCountChange = (count: number) => {
    setApplicationsInProgressCount(count);
  };
  const { idirUserDetails } = useContext(OnRouteBCContext);
  const tabs = [];
  const showApplicationsInProgressTab =
    idirUserDetails?.userAuthGroup !== IDIR_USER_AUTH_GROUP.FINANCE;
  if (showApplicationsInProgressTab) {
    tabs.push({
      label: "Applications in Progress",
      count: applicationsInProgressCount,
      component: (
        <RenderIf
          allowedRole={ROLES.READ_PERMIT}
          component={
            <ApplicationsInProgressList
              onCountChange={handleApplicationsCountChange}
            />
          }
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
      bannerButton={
        <RenderIf
          component={<StartApplicationAction />}
          disallowedAuthGroups={[IDIR_USER_AUTH_GROUP.FINANCE]}
        />
      }
      componentList={tabs}
    />
  );
});

PermitLists.displayName = "PermitLists";
