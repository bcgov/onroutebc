import React from "react";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { StartApplicationAction } from "../../pages/TermOversize/components/dashboard/StartApplicationAction";
import { ActivePermitList } from "../permit-list/ActivePermitList";
import { ExpiredPermitList } from "../permit-list/ExpiredPermitList";
import { InProgressApplicationList } from "../permit-list/InProgressApplicationList";

export const PermitLists = React.memo(() => {
  const tabs = [
    {
      label: "Applications in Progress",
      component: <InProgressApplicationList />,
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
