import "./ApplicationsInProgressList.scss";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { RowSelectionState } from "@tanstack/table-core";
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MRT_SortingState,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import {
  deleteApplications,
  getApplicationsInProgress,
} from "../../apiManager/permitsAPI";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import { ApplicationInProgressColumnDefinition } from "./ApplicationInProgressColumnDefinition";
import { DeleteConfirmationDialog } from "../../../../common/components/dialog/DeleteConfirmationDialog";
import { SnackBarContext } from "../../../../App";
import {
  ApplicationInProgress,
  PermitApplicationInProgress,
} from "../../types/application";
import { Delete } from "@mui/icons-material";
import { Trash } from "../../../../common/components/table/options/Trash";

/**
 * Dynamically set the column
 * @returns An array of column headers/accessor keys for Material React Table
 */
const getColumns = (): MRT_ColumnDef<ApplicationInProgress>[] => {
  return ApplicationInProgressColumnDefinition;
};

/**
 * A wrapper with the query to load the table with expired permits.
 */
export const ApplicationsInProgressList = () => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<MRT_SortingState>([
    {
      id: "startDate", // change to updateDateTime when backend supports it.
      desc: true,
    },
  ]);

  const applicationsQuery = useQuery({
    queryKey: [
      "applicationsInProgress",
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: () =>
      getApplicationsInProgress({
        page: pagination.pageIndex,
        take: pagination.pageSize,
        orderBy:
          sorting.length > 0
            ? [
                {
                  column: sorting.at(0)?.id as string,
                  descending: Boolean(sorting.at(0)?.desc),
                },
              ]
            : [],
      }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { data, isError, isPending, isFetching } = applicationsQuery;

  const snackBar = useContext(SnackBarContext);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const hasNoRowsSelected = Object.keys(rowSelection).length === 0;

  const columns = useMemo<MRT_ColumnDef<ApplicationInProgress>[]>(
    () => getColumns(),
    [],
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
    if (response.status === 201 || response.status === 200) {
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
      applicationsQuery.refetch();
    }
  };

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
    data: data?.items ?? [],
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
    onRowSelectionChange: setRowSelection,
    getRowId: (originalRow) => {
      const applicationRow = originalRow as PermitApplicationInProgress;
      return applicationRow.permitId;
    },
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    renderRowActions: useCallback(
      ({
        row,
      }: {
        table: MRT_TableInstance<ApplicationInProgress>;
        row: MRT_Row<ApplicationInProgress>;
      }) => (
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
      ),
      [],
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
    rowCount: data?.meta?.totalItems ?? 0,
    pageCount: data?.meta?.pageCount ?? 0,
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
    <div className="table-container">
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
