import React from "react";

import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { StartApplicationAction } from "../../pages/Application/components/dashboard/StartApplicationAction";
import { ActivePermitList } from "../permit-list/ActivePermitList";
import { ExpiredPermitList } from "../permit-list/ExpiredPermitList";
import { ApplicationsInProgressList } from "../permit-list/ApplicationsInProgressList";
import { useApplicationsInProgressQuery } from "../../hooks/hooks";

export const PermitLists = React.memo(() => {
  const query = useApplicationsInProgressQuery({});

  const tabs = [
    {
      label: "Applications in Progress",
      count: query?.applicationsInProgressQuery?.data?.items?.length,
      component: <ApplicationsInProgressList />,
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
