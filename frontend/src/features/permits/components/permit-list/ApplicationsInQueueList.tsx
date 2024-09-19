/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useApplicationsInQueueQuery } from "../../hooks/hooks";

export const ApplicationsInQueueList = () => {
  const {
    applicationsInQueueQuery,
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useApplicationsInQueueQuery();

  const {
    data: applicationsInQueue,
    isError,
    isPending,
    isFetching,
  } = applicationsInQueueQuery;

  console.log(applicationsInQueue);
  return <div>ApplicationsInQueueList</div>;
};
