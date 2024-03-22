import React, { useState } from "react";

import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { StartApplicationAction } from "../../pages/Application/components/dashboard/StartApplicationAction";
import { ActivePermitList } from "../permit-list/ActivePermitList";
import { ExpiredPermitList } from "../permit-list/ExpiredPermitList";
import { ApplicationsInProgressList } from "../permit-list/ApplicationsInProgressList";
import { Nullable } from "../../../../common/types/common";

export const PermitLists = React.memo(() => {

  const [applicationsInProgressCount, setApplicationsInProgressCount] = useState<Nullable<number>>();
  const handleApplicationsCountChange = (count: number) => {
      setApplicationsInProgressCount(count);
  };
  
  const tabs = [
    {
      label: "Applications in Progress",
      count: applicationsInProgressCount,
      component: <ApplicationsInProgressList onCountChange={handleApplicationsCountChange} />,
    },
    {
      label: "Active Permits",
      component: <ActivePermitList />,
    },
    {
      label: "Expired Permits",
      component: <ExpiredPermitList />,
    },
  ];

  return (
    <TabLayout
      bannerText="Permits"
      bannerButton={<StartApplicationAction />}
      componentList={tabs}
    />
  );
});

PermitLists.displayName = "PermitLists";
