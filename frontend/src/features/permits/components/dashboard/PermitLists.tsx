import React from "react";
import { AxiosError } from "axios";
import { Navigate } from "react-router-dom";

import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { Loading } from "../../../../common/pages/Loading";
import { ErrorFallback } from "../../../../common/pages/ErrorFallback";
import { List } from "../list/List";
import { StartApplicationAction } from "../../pages/TermOversize/components/dashboard/StartApplicationAction";
import { ActivePermitList } from "../permit-list/ActivePermitList";
import { ExpiredPermitList } from "../permit-list/ExpiredPermitList";
import { useApplicationsInProgressQuery } from "../../hooks/hooks";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { ERROR_ROUTES } from "../../../../routes/constants";

export const PermitLists = React.memo(() => {
  const { applicationsInProgressQuery } = useApplicationsInProgressQuery();
  const {
    data: applicationsInProgress,
    isLoading,
    isError,
    error,
  } = applicationsInProgressQuery;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return <Navigate to={ERROR_ROUTES.UNAUTHORIZED} />;
      }
      return <ErrorFallback error={error.message} />;
    }
  }

  const tabs = [
    {
      label: "Applications in Progress",
      count: applicationsInProgress?.length,
      component:
        applicationsInProgress?.length === 0 ? (
          <NoRecordsFound />
        ) : (
          <List query={applicationsInProgressQuery} />
        ),
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
