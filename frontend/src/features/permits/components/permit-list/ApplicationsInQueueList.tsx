/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useState } from "react";
import { RowSelectionState } from "@tanstack/table-core";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import "./ApplicationsInReviewList.scss";
import { getApplicationInQueueColumnDefinition } from "./ApplicationInQueueColumnDefinition";
import { SnackBarContext } from "../../../../App";
import { ApplicationListItem } from "../../types/application";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import {
  getDefaultNullableVal,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";
import {
  useClaimApplicationInQueueMutation,
  useUnclaimedApplicationsInQueueQuery,
} from "../../hooks/hooks";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import { MRT_Row } from "material-react-table";
import { ApplicationsInReviewRowOptions } from "./ApplicationsInReviewRowOptions";
import { APPLICATION_QUEUE_STATUSES } from "../../types/ApplicationQueueStatus";
import { useNavigate } from "react-router-dom";
import { APPLICATION_QUEUE_ROUTES } from "../../../../routes/constants";
import { Loading } from "../../../../common/pages/Loading";

export const ApplicationsInQueueList = () => {
  const {
    unclaimedApplicationsInQueueQuery,
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useUnclaimedApplicationsInQueueQuery();

  const {
    data: unclaimedApplications,
    isError: errorFetchingUnclaimedApplications,
    isPending: isPendingUnclaimedApplications,
    isFetching: isFetchingUnclaimedApplications,
  } = unclaimedApplicationsInQueueQuery;

  const [showAIRTable, setShowAIRTable] = useState<boolean>(false);

  useEffect(() => {
    const totalCount = getDefaultRequiredVal(
      0,
      unclaimedApplications?.meta?.totalItems,
    );
    setShowAIRTable(totalCount > 0);
  }, [unclaimedApplications?.meta?.totalItems]);

  const { idirUserDetails, userDetails } = useContext(OnRouteBCContext);
  const userRole = getDefaultNullableVal(
    idirUserDetails?.userRole,
    userDetails?.userRole,
  );

  const snackBar = useContext(SnackBarContext);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    if (errorFetchingUnclaimedApplications) {
      snackBar.setSnackBar({
        message: "An unexpected error occurred.",
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "error",
      });
    }
  }, [errorFetchingUnclaimedApplications]);

  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationListItem>();

  const handleFollowApplicationLink = (application: ApplicationListItem) => {
    setSelectedApplication(application);
    handleClaimApplication(application);
  };

  const {
    mutateAsync: claimApplication,
    data: claimApplicationResponse,
    isPending: claimApplicationPending,
  } = useClaimApplicationInQueueMutation();

  const handleClaimApplication = async (application: ApplicationListItem) => {
    await claimApplication({
      companyId: application.companyId,
      applicationId: application.permitId,
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (claimApplicationResponse?.status === 201) {
      navigate(
        `${APPLICATION_QUEUE_ROUTES.REVIEW}/${selectedApplication?.applicationNumber}`,
      );
    }
  }, [claimApplicationResponse]);

  const columns = getApplicationInQueueColumnDefinition(
    handleFollowApplicationLink,
  );

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns,
    data: getDefaultRequiredVal([], unclaimedApplications?.items),
    initialState: {
      ...defaultTableInitialStateOptions,
    },
    state: {
      ...defaultTableStateOptions,
      showAlertBanner: errorFetchingUnclaimedApplications,
      showProgressBars: isFetchingUnclaimedApplications,
      columnVisibility: { applicationId: true },
      isLoading: isPendingUnclaimedApplications,
      rowSelection,
      pagination,
      sorting,
    },
    layoutMode: "grid",
    displayColumnDefOptions: {
      "mrt-row-select": {
        size: 10,
      },
      "mrt-row-actions": {
        header: "",
        size: 40,
      },
    },
    enableRowActions: true,
    enableRowSelection: false,
    onRowSelectionChange: useCallback(setRowSelection, [userRole]),
    getRowId: (originalRow) => {
      const applicationRow = originalRow as ApplicationListItem;
      return applicationRow.permitId;
    },
    renderTopToolbar: false,
    enableGlobalFilter: false,
    autoResetPageIndex: false,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    rowCount: getDefaultRequiredVal(0, unclaimedApplications?.meta?.totalItems),
    pageCount: getDefaultRequiredVal(0, unclaimedApplications?.meta?.pageCount),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    enablePagination: true,
    enableBottomToolbar: true,
    muiToolbarAlertBannerProps: errorFetchingUnclaimedApplications
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableBodyRowProps: {
      className: "applications-in-review-list__row",
    },
    renderRowActions: useCallback(
      ({ row }: { row: MRT_Row<ApplicationListItem> }) => {
        return (
          <div>
            <ApplicationsInReviewRowOptions
              permitId={row.original.permitId}
              isInReview={
                row.original.applicationQueueStatus ===
                APPLICATION_QUEUE_STATUSES.IN_REVIEW
              }
            />
          </div>
        );
      },
      [],
    ),
  });

  if (claimApplicationPending) return <Loading />;

  return (
    <>
      {showAIRTable ? (
        <div className="applications-in-review-list table-container">
          <MaterialReactTable table={table} />
        </div>
      ) : (
        <NoRecordsFound />
      )}
    </>
  );
};
