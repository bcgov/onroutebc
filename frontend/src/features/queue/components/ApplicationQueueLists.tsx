import React from "react";
import { usePermissionMatrix } from "../../../common/authentication/PermissionMatrix";
import { TabLayout } from "../../../common/components/dashboard/TabLayout";
import { ApplicationsInQueueList } from "./ApplicationsInQueueList";
import { ClaimedApplicationsList } from "./ClaimedApplicationsList";
import {
  useClaimedApplicationsInQueueQuery,
  useUnclaimedApplicationsInQueueQuery,
} from "../hooks/hooks";

export const ApplicationQueueLists = React.memo(() => {
  const tabs = [];

  const showApplicationsInQueueTab = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "QUEUE",
      permissionMatrixFunctionKey: "VIEW_QUEUE",
    },
  });

  const { unclaimedApplicationsInQueueQuery } =
    useUnclaimedApplicationsInQueueQuery();

  const { data: unclaimedApplications } = unclaimedApplicationsInQueueQuery;

  if (showApplicationsInQueueTab) {
    tabs.push({
      label: "Applications",
      component: <ApplicationsInQueueList />,
      count: unclaimedApplications?.items.length,
    });
  }

  const showClaimedApplicationsTab = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "QUEUE",
      permissionMatrixFunctionKey: "VIEW_QUEUE",
    },
  });

  const { claimedApplicationsInQueueQuery } =
    useClaimedApplicationsInQueueQuery();

  const { data: claimedApplications } = claimedApplicationsInQueueQuery;

  if (showClaimedApplicationsTab) {
    tabs.push({
      label: "Claimed",
      component: <ClaimedApplicationsList />,
      count: claimedApplications?.items.length,
    });
  }

  return <TabLayout bannerText="Queue" componentList={tabs} />;
});

ApplicationQueueLists.displayName = "ApplicationQueueLists";
