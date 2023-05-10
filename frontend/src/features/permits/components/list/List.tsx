import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table";
import { RowSelectionState } from "@tanstack/table-core";
import "../../../manageVehicles/components/list/List.scss";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Filter } from "../../../../features/manageVehicles/components/options/Filter";
import { Trash } from "../../../../features/manageVehicles/components/options/Trash";
import { CSVOptions } from "../../../../features/manageVehicles/components/options/CSVOptions";
import { Delete, ContentCopy } from "@mui/icons-material";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { UseQueryResult } from "@tanstack/react-query";
import DeleteConfirmationDialog from "../../../manageVehicles/components/list/ConfirmationDialog";
import { SnackBarContext } from "../../../../App";
import { ApplicationInProgress } from "../../types/application";
import { ApplicationInProgressColumnDefinition, ApplicationNotFoundColumnDefinition} from "./Columns";
import { deleteApplicationsInProgress } from "../../apiManager/permitsAPI";
import { Vehicle } from "../../../manageVehicles/types/managevehicles";
import { PowerUnit } from "../../../manageVehicles/types/managevehicles";
import { PermitApplicationInProgress } from "../../types/application";


/**
 * Dynamically set the column
 * @returns An array of column headers/accessor keys ofr Material React Table
 */
const getColumns = (
): MRT_ColumnDef<ApplicationInProgress>[] => {
  return ApplicationInProgressColumnDefinition;
};

const getNotFound = (
  ): MRT_ColumnDef<ApplicationInProgress>[] => {
    return ApplicationNotFoundColumnDefinition;
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
  ({
    query,
  }: {
    query: UseQueryResult<ApplicationInProgress[]>;
  }) => {
    // Data, fetched from backend API
    const {
      data,
      isError,
      isFetching,
      isLoading,
    } = query;

    const columns = useMemo<MRT_ColumnDef<ApplicationInProgress>[]>(
      () => getColumns(),
      []
    );

    const snackBar = useContext(SnackBarContext);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
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
    const onConfirmApplicationDelete = () => {
      console.log("delete applications: to be implemented");
      const applicationNumbers: string[] = Object.keys(rowSelection);

      deleteApplicationsInProgress(applicationNumbers).then((response) => {
        if (response.status === 200) {
          response
            .json()
            .then((responseBody: { success: string[]; failure: string[] }) => {
              setIsDeleteDialogOpen(() => false);
              if (responseBody.failure.length > 0) {
                snackBar.setSnackBar({
                  message: "An unexpected error occurred.",
                  showSnackbar: true,
                  setShowSnackbar: () => true,
                  alertType: "error",
                });
              } else {
                snackBar.setSnackBar({
                  message: "Application(s) Deleted",
                  showSnackbar: true,
                  setShowSnackbar: () => true,
                  alertType: "info",
                });
              }
              setRowSelection(() => {
                return {};
              });
              query.refetch();
            });
        }
      });
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

    return (
      <div className="table-container">
        <MaterialReactTable
          columns={columns}
          data={data ?? []}
          state={{
            showAlertBanner: isError,
            showProgressBars: isFetching,
            columnVisibility: { applicationId: true },
            rowSelection: rowSelection,
            isLoading,
          }}
          selectAllMode="page"
          onRowSelectionChange={setRowSelection}
          enableStickyHeader
          positionActionsColumn="last"
          // Disable the default column actions so that we can use our custom actions
          enableColumnActions={false}
          enableRowSelection={true}
          // Row copy, delete, and edit options
          getRowId={(originalRow) => {
            const applicationRow = originalRow as PermitApplicationInProgress;
            return applicationRow.applicationNumber as string;
          }}
          enableRowActions={true} 
          displayColumnDefOptions={{
            "mrt-row-actions": {
              header: "",
            },
          }}
          renderRowActions={useCallback(
            ({
              table,
              row,
            }: {
              table: MRT_TableInstance<ApplicationInProgress>;
              row: MRT_Row<ApplicationInProgress>;
            }) => (
              <Box sx={{justifyContent: "flex-end", display: "flex"}}>
                <Tooltip arrow placement="top" title="Make a copy">
                  <IconButton
                    disabled={false}
                    onClick={() => table.setEditingRow(row)}
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="top" title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => {
                          setIsDeleteDialogOpen(() => true);
                          setRowSelection(() => {
                            const newObject: { [key: string]: boolean } = {};
                            // Setting the selected row to false so that
                            // the row appears unchecked.
                            newObject[
                              row.getValue(`applicationNumber`) as string
                            ] = false;
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
            []
          )}
          // Render a custom options Bar (inclues search, filter, trash, and csv options)
          renderTopToolbar={useCallback(
            ({ table }: { table: MRT_TableInstance<ApplicationInProgress> }) => (
              <Box
                sx={{
                  display: "flex",
                  padding: "20px 0px",
                  backgroundColor: "white",
                }}
              >
                <MRT_GlobalFilterTextField table={table} />
                <Filter />
                <Trash onClickTrash={onClickTrashIcon} />
                <CSVOptions />
              </Box>
            ),
            []
          )}
          /*
           *
           * STYLES
           *
           */

          // Main table container
          muiTablePaperProps={{
            sx: {
              border: "none",
              boxShadow: "none",
            },
          }}
          // Column widths
          defaultColumn={{
            size: 50,
            maxSize: 200,
            minSize: 25,
          }}
          // Cell/Body container
          muiTableContainerProps={{
            sx: {
              height: "calc(100vh - 475px)",
              outline: "1px solid #DBDCDC",
            },
          }}
          // Pagination
          muiBottomToolbarProps={{
            sx: {
              backgroundColor: BC_COLOURS.bc_background_light_grey,
              zIndex: 0,
            },
          }}
          
          // Alert banner
          muiToolbarAlertBannerProps={
            isError
              ? {
                  color: "error",
                  children: "Error loading data",
                }
              : undefined
          }
          // Top toolbar
          muiTopToolbarProps={{ sx: { zIndex: 0 } }}
          // Search Bar
          positionGlobalFilter="left"
          initialState={{ showGlobalFilter: true }} //show the search bar by default
          muiSearchTextFieldProps={{
            placeholder: "Search",
            sx: {
              minWidth: "300px",
              backgroundColor: "white",
            },
            variant: "outlined",
            inputProps: {
              sx: {
                padding: "10px",
              },
            },
          }}
          // Row Header
          muiTableHeadRowProps={{
            sx: { 
              backgroundColor: BC_COLOURS.bc_background_light_grey 
            },
          }}
        />
        <DeleteConfirmationDialog
          onClickDelete={onConfirmApplicationDelete}
          isOpen={isDeleteDialogOpen}
          onClickCancel={onCancelApplicationDelete}
        />
      </div>
    );
  }
);

List.displayName = "List";