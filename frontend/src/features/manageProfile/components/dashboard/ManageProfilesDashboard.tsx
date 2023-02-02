import React from "react";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { CompanyInfo } from "../pages/CompanyInfo";

export const ManageProfilesDashboard = React.memo(() => {
  const tabs = [
    {
      label: "Company Information",
      component: <CompanyInfo />,
    },
    {
      label: "My Information",
      component: <>TODO</>,
    },
    {
      label: "User Management",
      component: <>TODO</>,
    },
    {
      label: "Payment Information",
      component: <>TODO</>,
    },
  ];

  return <TabLayout bannerText="Profile" componentList={tabs} />;
});

ManageProfilesDashboard.displayName = "ManageProfilesDashboard";
