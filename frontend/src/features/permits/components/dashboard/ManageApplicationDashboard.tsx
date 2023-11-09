import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { Unauthorized } from "../../../../common/pages/Unauthorized";
import { Loading } from "../../../../common/pages/Loading";
import { ErrorFallback } from "../../../../common/pages/ErrorFallback";
import { List } from "../list/List";
import { getApplicationsInProgress } from "../../../../features/permits/apiManager/permitsAPI";
import { StartApplication } from "../../pages/TermOversize/components/dashboard/StartApplication";
import { ActivePermitList } from "../permit-list/ActivePermitList";
import { ExpiredPermitList } from "../permit-list/ExpiredPermitList";
import { FIVE_MINUTES } from "../../../../common/constants/constants";

export const ManageApplicationDashboard = React.memo(() => {
  const keepPreviousData = true;

  const applicationInProgressQuery = useQuery({
    queryKey: ["applicationInProgress"],
    queryFn: getApplicationsInProgress,
    keepPreviousData: keepPreviousData,
    staleTime: FIVE_MINUTES,
  });

  const { data, isLoading, isError, error } = applicationInProgressQuery;

  const [numActivePermits, setNumActivePermits] = useState<number>(0);
  const [numExpiredPermits, setNumExpiredPermits] = useState<number>(0);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return <Unauthorized />;
      }
      return <ErrorFallback error={error.message} />;
    }
  }

  const tabs = [
    {
      label: "Applications in Progress",
      count: data?.length,
      component:
        data?.length === 0 ? (
          <div
            style={{
              padding: "20px 0px",
              backgroundColor: "white",
              textAlign: "center",
            }}
          >
            <div>
              <img
                src="No_Data_Graphic.svg"
                style={{
                  width: "124px",
                  height: "112px",
                  marginTop: "80px",
                }}
              />
            </div>
            <div>
              <h3>No Records Found.</h3>
            </div>
          </div>
        ) : (
          <List query={applicationInProgressQuery} />
        ),
    },
    {
      label: "Active Permits",
      count: numActivePermits,
      component: <ActivePermitList setNumFetchedPermits={setNumActivePermits} />,
    },
    {
      label: "Expired Permits",
      count: numExpiredPermits,
      component: <ExpiredPermitList setNumFetchedPermits={setNumExpiredPermits} />,
    },
    /**
     * Enable Applications in Review page navigation when page is ready
    {
      label: "Applications in Review",
      component: <>TODO</>,
    },*/
  ];

  return (
    <TabLayout
      bannerText="Permits"
      bannerButton={<StartApplication />}
      componentList={tabs}
    />
  );
});

ManageApplicationDashboard.displayName = "ManageApplicationDashboard";
