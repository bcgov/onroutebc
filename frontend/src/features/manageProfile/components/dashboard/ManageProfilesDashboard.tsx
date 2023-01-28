import React from "react";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { CompanyInfoPage } from "../companyInfoPage/CompanyInfoPage";

export const ManageProfilesDashboard = React.memo(() => {
  const tabs = [
    {
      label: "Company Information",
      component: <CompanyInfoPage />,
    },
    {
      label: "My Information",
      component: <>TODO</>,
    },
  ];

  return <TabLayout bannerText="Profile" componentList={tabs} />;
});

ManageProfilesDashboard.displayName = "ManageProfilesDashboard";
