import { Delete } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { RowSelectionState } from "@tanstack/table-core";
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import "./ApplicationsInProgressList.scss";
import { ApplicationInProgressColumnDefinition } from "./ApplicationInProgressColumnDefinition";
import { DeleteConfirmationDialog } from "../../../../common/components/dialog/DeleteConfirmationDialog";
import { SnackBarContext } from "../../../../App";
import { ApplicationListItem } from "../../types/application";
import { Trash } from "../../../../common/components/table/options/Trash";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { canUserAccessApplication } from "../../helpers/mappers";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { getDefaultNullableVal, getDefaultRequiredVal } from "../../../../common/helpers/util";
import { UserAuthGroupType } from "../../../../common/authentication/types";
import { Nullable } from "../../../../common/types/common";
import { deleteApplications } from "../../apiManager/permitsAPI";
import { PermitApplicationOrigin } from "../../types/PermitApplicationOrigin";
import { useApplicationsInProgressQuery, usePendingPermitsQuery } from "../../hooks/hooks";
import { WarningBcGovBanner } from "../../../../common/components/banners/WarningBcGovBanner";
import { PendingPermitsDialog } from "../dialog/PendingPermitsDialog/PendingPermitsDialog";
import { CustomActionLink } from "../../../../common/components/links/CustomActionLink";

import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";

/**
 * Dynamically set the column
 * @returns An array of column headers/accessor keys for Material React Table
 */
const getColumns = (
  userAuthGroup?: Nullable<UserAuthGroupType>,
): MRT_ColumnDef<ApplicationListItem>[] => {
  return ApplicationInProgressColumnDefinition(userAuthGroup);
};

/**
 * A wrapper with the query to load the table with expired permits.
 */
export const ApplicationsInProgressList = ({
  onCountChange,
}: {
  onCountChange: (count: number) => void;
}) => {
  const {
    applicationsInProgressQuery,
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useApplicationsInProgressQuery();

  const {
    pendingPermits,
    pagination: pendingPermitPagination,
    setPagination: setPendingPermitPagination,
  } = usePendingPermitsQuery();

  const {
    data: applicationsInProgress,
    isError,
    isPending,
    isFetching,
  } = applicationsInProgressQuery;

  const pendingCount = getDefaultRequiredVal(0, pendingPermits?.meta?.totalItems);
  const canShowPendingBanner = pendingCount > 0;

  useEffect(() => {
    const totalCount = getDefaultRequiredVal(0, applicationsInProgress?.meta?.totalItems);
    onCountChange(totalCount);
  }, [applicationsInProgress?.meta?.totalItems])

  const { idirUserDetails, userDetails } = useContext(OnRouteBCContext);
  const userAuthGroup = getDefaultNullableVal(
    idirUserDetails?.userAuthGroup,
    userDetails?.userAuthGroup,
  );

  const snackBar = useContext(SnackBarContext);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const hasNoRowsSelected = Object.keys(rowSelection).length === 0;
  const [showPendingPermitsModal, setShowPendingPermitsModal] = useState<boolean>(false);

  const columns = useMemo<MRT_ColumnDef<ApplicationListItem>[]>(
    () => getColumns(userAuthGroup),
    [userAuthGroup],
  );

  /**
   * Callback function for clicking on the Trash icon above the Table.
   */
  const onClickTrashIcon = useCallback(() => {
    setIsDeleteDialogOpen(() => true);
  }, []);

  /**
   * Function that deletes a application once the user confirms the delete action
   * in the confirmation dialog.
   */
  const onConfirmApplicationDelete = async () => {
    const applicationIds: string[] = Object.keys(rowSelection);
    const response = await deleteApplications(applicationIds);
    if (response.status === 200) {
      const responseBody = response.data;
      setIsDeleteDialogOpen(() => false);
      if (responseBody.failure.length > 0) {
        snackBar.setSnackBar({
          alertType: "error",
          message: "An unexpected error occurred.",
          setShowSnackbar: () => true,
          showSnackbar: true,
        });
      } else {
        snackBar.setSnackBar({
          message: "Application Deleted",
          alertType: "info",
          setShowSnackbar: () => true,
          showSnackbar: true,
        });
      }
      setRowSelection(() => {
        return {};
      });
      applicationsInProgressQuery.refetch();
    }
  };

  /**
   * Determines if a row can be selected
   */
  const canRowBeSelected = useCallback(
    (permitApplicationOrigin?: Nullable<PermitApplicationOrigin>) =>
      canUserAccessApplication(
        permitApplicationOrigin,
        userAuthGroup,
      ),
    [userAuthGroup],
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

  /**
   * Function that clears the delete related states when the user clicks on cancel.
   */
  const onCancelApplicationDelete = useCallback(() => {
    setRowSelection(() => {
      return {};
    });
    setIsDeleteDialogOpen(() => false);
  }, []);

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: columns,
    data: getDefaultRequiredVal([], applicationsInProgress?.items),
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
    enableRowSelection:
      (row) => canRowBeSelected(
        row?.original?.permitApplicationOrigin,
      ),
    onRowSelectionChange: useCallback(
      setRowSelection,
      [userAuthGroup],
    ),
    getRowId: (originalRow) => {
      const applicationRow = originalRow as ApplicationListItem;
      return applicationRow.permitId;
    },
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    renderRowActions: useCallback(
      ({
        row,
      }: {
        table: MRT_TableInstance<ApplicationListItem>;
        row: MRT_Row<ApplicationListItem>;
      }) => canUserAccessApplication(
        row?.original?.permitApplicationOrigin,
        userAuthGroup,
      ) ? (
        <Box className="table-container__row-actions">
          <Tooltip arrow placement="top" title="Delete">
            <IconButton
              color="error"
              onClick={() => {
                setIsDeleteDialogOpen(() => true);
                setRowSelection(() => {
                  const newObject: { [key: string]: boolean } = {};
                  // Setting the selected row to false so that
                  // the row appears unchecked.
                  newObject[row.original.permitId] = false;
                  return newObject;
                });
              }}
              disabled={false}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <></>
      ),
      [userAuthGroup],
    ),
    renderToolbarInternalActions: useCallback(
      () => (
        <Trash onClickTrash={onClickTrashIcon} disabled={hasNoRowsSelected} />
      ),
      [hasNoRowsSelected],
    ),
    enableGlobalFilter: false,
    autoResetPageIndex: false,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    rowCount: getDefaultRequiredVal(0, applicationsInProgress?.meta?.totalItems),
    pageCount: getDefaultRequiredVal(0, applicationsInProgress?.meta?.pageCount),
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
  });

  return (
    <div className="applications-in-progress-list table-container">
      {canShowPendingBanner ? (
        <WarningBcGovBanner
          className="pending-permits-warning"
          msg={
            <div className="pending-permits-warning__msg">
              <span>Some of your applications weren&apos;t processed. See your</span>
              <CustomActionLink
                className="pending-permits-warning__link"
                onClick={() => setShowPendingPermitsModal(true)}
              >
                Pending Permits
              </CustomActionLink>
            </div>
          }
        />
      ) : null}

      <PendingPermitsDialog
        showModal={showPendingPermitsModal}
        onCancel={() => setShowPendingPermitsModal(false)}
        pendingPermits={pendingPermits}
        pagination={pendingPermitPagination}
        setPagination={setPendingPermitPagination}
      />

      <MaterialReactTable table={table} />

      <DeleteConfirmationDialog
        onClickDelete={onConfirmApplicationDelete}
        isOpen={isDeleteDialogOpen}
        onClickCancel={onCancelApplicationDelete}
        caption="application"
      />
    </div>
  );
};
