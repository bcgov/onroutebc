import React from "react";
import { ManageProfilesDashboard } from "./components/dashboard/ManageProfilesDashboard";

export const ManageProfiles = React.memo(() => {
  return <ManageProfilesDashboard />;
});

ManageProfiles.displayName = "ManageProfiles";
