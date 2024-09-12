import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { RowSelectionState } from "@tanstack/table-core";
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import "./ApplicationsInReviewList.scss";
import { ApplicationInReviewColumnDefinition } from "./ApplicationInReviewColumnDefinition";
import { SnackBarContext } from "../../../../App";
import { ApplicationListItem } from "../../types/application";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import {
  getDefaultNullableVal,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";
import { UserRoleType } from "../../../../common/authentication/types";
import { Nullable } from "../../../../common/types/common";
import { useApplicationsInQueueQuery } from "../../hooks/hooks";
import { InfoBcGovBanner } from "../../../../common/components/banners/InfoBcGovBanner";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import { BANNER_MESSAGES } from "../../../../common/constants/bannerMessages";
import { MRT_Row } from "material-react-table";
import { ApplicationsInReviewRowOptions } from "./ApplicationsInReviewRowOptions";
import { APPLICATION_QUEUE_STATUSES } from "../../types/ApplicationQueueStatus";

const getColumns = (
  userRole?: Nullable<UserRoleType>,
): MRT_ColumnDef<ApplicationListItem>[] => {
  return ApplicationInReviewColumnDefinition(userRole);
};

export const ApplicationsInReviewList = () => {
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
  const [showAIRTable, setShowAIRTable] = useState<boolean>(false);

  useEffect(() => {
    const totalCount = getDefaultRequiredVal(
      0,
      applicationsInQueue?.meta?.totalItems,
    );
    setShowAIRTable(totalCount > 0);
  }, [applicationsInQueue?.meta?.totalItems]);

  const { idirUserDetails, userDetails } = useContext(OnRouteBCContext);
  const userRole = getDefaultNullableVal(
    idirUserDetails?.userRole,
    userDetails?.userRole,
  );

  const snackBar = useContext(SnackBarContext);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo<MRT_ColumnDef<ApplicationListItem>[]>(
    () => getColumns(userRole),
    [userRole],
  );

  useEffect(() => {
    if (isError) {
      snackBar.setSnackBar({
        message: "An unexpected error occurred.",
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "error",
      });
    }
  }, [isError]);

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: columns,
    data: getDefaultRequiredVal([], applicationsInQueue?.items),
    initialState: {
      ...defaultTableInitialStateOptions,
    },
    state: {
      ...defaultTableStateOptions,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      columnVisibility: { applicationId: true },
      isLoading: isPending,
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
    rowCount: getDefaultRequiredVal(0, applicationsInQueue?.meta?.totalItems),
    pageCount: getDefaultRequiredVal(0, applicationsInQueue?.meta?.pageCount),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    enablePagination: true,
    enableBottomToolbar: true,
    muiToolbarAlertBannerProps: isError
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
        /* TODO the swagger docs use the term "applicationId" when targetting specific applications
           check with Praveen if this is correct as we only have "permitId" or "applicationNumber"
        **/
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

  return (
    <>
      {showAIRTable ? (
        <div className="applications-in-review-list table-container">
          <InfoBcGovBanner
            className="applications-in-review-banner"
            msg={BANNER_MESSAGES.REJECTED_APPLICATIONS}
          />

          <MaterialReactTable table={table} />
        </div>
      ) : (
        <NoRecordsFound />
      )}
    </>
  );
};
