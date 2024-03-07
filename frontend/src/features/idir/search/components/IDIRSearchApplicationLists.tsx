import React from "react";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { IDIRApplicationSearchResults } from "./IDIRApplicationSearchResults";
import { SearchFields } from "../types/types";
import { StartApplicationAction } from "../../../permits/pages/TermOversize/components/dashboard/StartApplicationAction";

export const IDIRSearchApplicationLists = React.memo(
    ({
        searchParams,
      }: {
        /**
         * The search parameters entered by the user.
         */
        searchParams: SearchFields;
      }) => {

  const tabs = [
    {
      label: "Applications in Progress",
      component: <IDIRApplicationSearchResults searchParams={searchParams} />,
    },
    {
        label: "Active Permits",
        component: <div>Active Permits</div>,
    },
    {
        label: "Expired Permits",
        component: <div>Expired Permits</div>,
    },
    {
        label: "Applications in Review",
        component: <div>Application in Review</div>,
    }
  ];

  return (
    <TabLayout
      bannerText="Permits"
      bannerButton={<StartApplicationAction />}
      componentList={tabs}
    />
    
  );
});

IDIRSearchApplicationLists.displayName = "IDIRSearchApplicationLists";
