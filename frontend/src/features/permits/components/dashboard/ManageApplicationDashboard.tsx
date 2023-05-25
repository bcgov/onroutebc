import React from "react";
import { TabLayout } from "../../../../common/components/dashboard/TabLayout";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Unauthorized } from "../../../../common/pages/Unauthorized";
import { Loading } from "../../../../common/pages/Loading";
import { ErrorFallback } from "../../../../common/pages/ErrorFallback";
import { List } from "../list/List";
import { getApplicationsInProgress } from "../../../../features/permits/apiManager/permitsAPI";
import { StartApplicationButton } from "../../../../features/permits/pages/TermOversize/form/VehicleDetails/customFields/StartApplicationButton";

export const ManageApplicationDashboard = React.memo(() => {

  const keepPreviousData = true;
  const staleTime = 5000;

  const applicationInProgressQuery = useQuery({
    queryKey: ["applicationInProgress"],
    queryFn: getApplicationsInProgress,
    keepPreviousData: keepPreviousData,
    staleTime: staleTime,
  });

  const {
    data,
    isLoading,
    isError,
    error,
    //refetch,
  } = useQuery({
    queryKey: ["applicationInProgress"],
    queryFn: getApplicationsInProgress,
    keepPreviousData: true,
    staleTime: 5000,
  });

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
      component: (data?.length === 0)?
                  <div
                  style={{
                    textAlign: "center",
                    padding: "20px 0px",
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  >
                    <div>
                      <img src="No_Data_Graphic.svg"
                      style={{
                        width: "124px",
                        height: "112px",
                        marginTop: "80px",
                      }}
                      />
                    </div>
                    <div>
                      <label><strong>No Records Found.</strong></label>
                    </div>
                    </div>
                  :<List query={applicationInProgressQuery} />,
    },
    {
      label: "Applications in Review",
      component: <>TODO</>,
    },
    {
      label: "Active Permits",
      component: <>TODO</>,
    },
    {
      label: "Expired Permits",
      component: <>TODO</>,
    },
  ];

  return <TabLayout bannerText="Permits" bannerButton={<StartApplicationButton/>} componentList={tabs} />;
});

ManageApplicationDashboard.displayName = "ManageApplicationDashboard";
