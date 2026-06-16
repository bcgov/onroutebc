import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { ERROR_ROUTES } from "../../../../routes/constants";

import { ManageSettingsDashboardPage } from "./ManageSettingsDashboardPage";

export const ManageSettingsDashboard = React.memo(() => {
  const { companyId } = useContext(OnRouteBCContext);

  if (!companyId) {
    return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;
  }

  return <ManageSettingsDashboardPage companyId={companyId} />;
});

ManageSettingsDashboard.displayName = "ManageSettingsDashboard";
