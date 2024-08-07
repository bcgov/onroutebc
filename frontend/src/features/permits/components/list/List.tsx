import { RowSelectionState } from "@tanstack/table-core";
import { Box, IconButton, Tooltip } from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";
import { Delete } from "@mui/icons-material";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_Row,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import "./List.scss";
import { TrashButton } from "../../../../common/components/buttons/TrashButton";
import { DeleteConfirmationDialog } from "../../../../common/components/dialog/DeleteConfirmationDialog";
import { SnackBarContext } from "../../../../App";
import { ApplicationListItem } from "../../types/application";
import { ApplicationInProgressColumnDefinition } from "./Columns";
import { deleteApplications } from "../../apiManager/permitsAPI";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import {
  defaultTableOptions,
  defaultTableStateOptions,
  defaultTableInitialStateOptions,
} from "../../../../common/helpers/tableHelper";

/**
 * Dynamically set the column
 * @returns An array of column headers/accessor keys for Material React Table
 */
const getColumns = (): MRT_ColumnDef<ApplicationListItem>[] => {
  return ApplicationInProgressColumnDefinition;
};

/*
 *
 * The List component uses Material React Table (MRT)
 * For detailed documentation, see here:
 * https://www.material-react-table.com/docs/getting-started/usage
 *
 *
 */
/* eslint-disable react/prop-types */
export const List = memo(
  ({ query }: { query: UseQueryResult<ApplicationListItem[]> }) => {
    // Data, fetched from backend API
    const { data, isError, isFetching, isPending } = query;

    const columns = useMemo<MRT_ColumnDef<ApplicationListItem>[]>(
      () => getColumns(),
      [],
    );

    const snackBar = useContext(SnackBarContext);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const hasNoRowsSelected = Object.keys(rowSelection).length === 0;

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
        query.refetch();
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
      data: data ?? [],
      state: {
        ...defaultTableStateOptions,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        columnVisibility: { applicationId: true },
        rowSelection: rowSelection,
        isLoading: isPending,
      },
      initialState: {
        ...defaultTableInitialStateOptions,
      },
      onRowSelectionChange: setRowSelection,
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
      // Render a custom options Bar (inclues search and trash)
      renderTopToolbar: useCallback(
        ({ table }: { table: MRT_TableInstance<ApplicationListItem> }) => (
          <Box className="table-container__top-toolbar">
            <MRT_GlobalFilterTextField table={table} />
            <TrashButton
              onClickTrash={onClickTrashIcon}
              disabled={hasNoRowsSelected}
            />
          </Box>
        ),
        [hasNoRowsSelected],
      ),

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
          onDelete={onConfirmApplicationDelete}
          showDialog={isDeleteDialogOpen}
          onCancel={onCancelApplicationDelete}
          itemToDelete="application"
        />
      </div>
    );
  },
);

List.displayName = "List";
