import React, { useState } from "react";

import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { RenderIf } from "../../../../common/components/reusable/RenderIf";
import { Nullable } from "../../../../common/types/common";
import { StartApplicationAction } from "../../pages/Application/components/dashboard/StartApplicationAction";
import { ActivePermitList } from "../permit-list/ActivePermitList";
import { ApplicationsInProgressList } from "../permit-list/ApplicationsInProgressList";
import { ExpiredPermitList } from "../permit-list/ExpiredPermitList";
import { usePermissionMatrix } from "../../../../common/authentication/PermissionMatrix";

export const PermitLists = React.memo(() => {
  const [applicationsInProgressCount, setApplicationsInProgressCount] =
    useState<Nullable<number>>();
  const handleApplicationsCountChange = (count: number) => {
    setApplicationsInProgressCount(count);
  };
  const tabs = [];
  const showApplicationsInProgressTab = usePermissionMatrix({
    permissionMatrixFeatureKey: "MANAGE_PERMITS",
    permissionMatrixFunctionKey: "VIEW_LIST_OF_APPLICATIONS_IN_PROGRESS",
  });

  if (showApplicationsInProgressTab) {
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
      bannerButton={
        <RenderIf
          component={<StartApplicationAction />}
          permissionMatrixFeatureKey="MANAGE_PERMITS"
          permissionMatrixFunctionKey="START_APPLICATION"
        />
      }
      componentList={tabs}
    />
  );
});

PermitLists.displayName = "PermitLists";
