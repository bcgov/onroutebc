import { RowSelectionState } from "@tanstack/table-core";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { UseQueryResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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

import "./List.scss";
import { Trash } from "../../../../common/components/table/options/Trash";
import { DeleteConfirmationDialog } from "../../../../common/components/dialog/DeleteConfirmationDialog";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { PowerUnitColumnDefinition, TrailerColumnDefinition } from "./Columns";
import { deleteVehicles } from "../../apiManager/vehiclesAPI";
import { SnackBarContext } from "../../../../App";
import { MANAGE_VEHICLES } from "../../../../routes/constants";
import { DoesUserHaveRoleWithContext } from "../../../../common/authentication/util";
import { ROLES } from "../../../../common/authentication/types";
import {
  VehicleTypes,
  VehicleTypesAsString,
  PowerUnit,
  Trailer
} from "../../types/managevehicles";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { usePowerUnitTypesQuery, useTrailerTypesQuery } from "../../apiManager/hooks";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";

/**
 * Dynamically set the column based on vehicle type
 * @param vehicleType Either "powerUnit" | "trailer"
 * @returns An array of column headers/accessor keys for Material React Table
 */
const getColumns = (
  vehicleType: VehicleTypesAsString
): MRT_ColumnDef<VehicleTypes>[] => {
  if (vehicleType === "powerUnit") {
    return PowerUnitColumnDefinition;
  }
  return TrailerColumnDefinition;
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
    vehicleType,
    query,
    companyId,
  }: {
    vehicleType: VehicleTypesAsString;
    query: UseQueryResult<VehicleTypes[]>;
    companyId: string;
  }) => {
    // Data, fetched from backend API
    const {
      data,
      isError,
      isFetching,
      isLoading
    } = query;

    // Column definitions for the table
    const columns = useMemo<MRT_ColumnDef<VehicleTypes>[]>(
      () => getColumns(vehicleType),
      []
    );

    const snackBar = useContext(SnackBarContext);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const hasNoRowsSelected = Object.keys(rowSelection).length === 0;
   
    const powerUnitTypesQuery = usePowerUnitTypesQuery()
    const trailerTypesQuery = useTrailerTypesQuery()
    const fetchedPowerUnitTypes = getDefaultRequiredVal([], powerUnitTypesQuery.data)
    const fetchedTrailerTypes = getDefaultRequiredVal([], trailerTypesQuery.data)

    const colTypeCodes = columns.filter((item) => item.accessorKey === `${vehicleType}TypeCode`)
    const newColumns = columns.filter((item) => item.accessorKey !== `${vehicleType}TypeCode`)

    const transformVehicleCode = (code:string) => {
      let val
      if (vehicleType === 'powerUnit') {
        val = fetchedPowerUnitTypes?.filter((value) => value.typeCode === code)
      } else {
        val = fetchedTrailerTypes?.filter((value) => value.typeCode === code)
      }
      return val?.at(0)?.type || ''
    }

    if (colTypeCodes?.length === 1) {
      const colTypeCode = colTypeCodes?.at(0)
      if (colTypeCode) {
        // eslint-disable-next-line react/display-name
        colTypeCode.Cell = ({cell}) => {
          return <div>{transformVehicleCode(cell.getValue<string>())}</div>
        }

        const colDate = newColumns?.pop()
        newColumns.push(colTypeCode)
        if (colDate) newColumns.push(colDate)
      }
    }

    /**
     * Callback function for clicking on the Trash icon above the Table.
     */
    const onClickTrashIcon = useCallback(() => {
      setIsDeleteDialogOpen(() => true);
    }, []);

    /**
     * Function that deletes a vehicle once the user confirms the delete action
     * in the confirmation dialog.
     */
    const onConfirmDelete = async () => {
      const vehicleIds: string[] = Object.keys(rowSelection);

      const response = await deleteVehicles(vehicleIds, vehicleType, companyId);
      if (response.status === 200) {
        const responseBody = response.data;
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
            message: "Vehicle Deleted",
            showSnackbar: true,
            setShowSnackbar: () => true,
            alertType: "info",
          });
        }
        setRowSelection(() => {
          return {};
        });
        query.refetch();
      }
    };

    const navigate = useNavigate();

    /**
     * Function that clears the delete related states when the user clicks on cancel.
     */
    const onCancelDelete = useCallback(() => {
      setIsDeleteDialogOpen(() => false);
      setRowSelection(() => {
        return {};
      });
    }, []);

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
    // End snackbar code for error handling

    return (
      <div className="table-container">
        <MaterialReactTable
          // Required Props
          data={data ?? []}
          columns={newColumns}
          // State variables and actions
          state={{
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isFetching,
            sorting: [{ id: "createdDateTime", desc: true }],
            columnVisibility: { powerUnitId: false, trailerId: false },
            rowSelection: rowSelection,
          }}
          // Disable the default column actions so that we can use our custom actions
          enableColumnActions={false}
          // Enable checkboxes for row selection
          enableRowSelection={true}
          // Row copy, delete, and edit options
          getRowId={(originalRow) => {
            if (vehicleType === "powerUnit") {
              const powerUnitRow = originalRow as PowerUnit;
              return powerUnitRow.powerUnitId as string;
            } else {
              const trailerRow = originalRow as Trailer;
              return trailerRow.trailerId as string;
            }
          }}
          enableRowActions={true}
          selectAllMode="page"
          onRowSelectionChange={setRowSelection}
          enableStickyHeader
          positionActionsColumn="last"
          displayColumnDefOptions={{
            "mrt-row-actions": {
              header: "",
            },
          }}
          renderEmptyRowsFallback={() => <NoRecordsFound />}
          renderRowActions={useCallback(
            ({
              row,
            }: {
              table: MRT_TableInstance<VehicleTypes>;
              row: MRT_Row<VehicleTypes>;
            }) => (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {DoesUserHaveRoleWithContext(ROLES.WRITE_VEHICLE) && (
                  <>
                    <Tooltip arrow placement="left" title="Edit">
                      {/*tslint:disable-next-line*/}
                      <IconButton
                        onClick={() => {
                          if (vehicleType === "powerUnit") {
                            navigate(
                              `/${MANAGE_VEHICLES}/power-units/${row.getValue(
                                "powerUnitId"
                              )}`
                            );
                          } else if (vehicleType === "trailer") {
                            navigate(
                              `/${MANAGE_VEHICLES}/trailers/${row.getValue(
                                "trailerId"
                              )}`
                            );
                          }
                        }}
                        disabled={false}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip arrow placement="top" title="Delete">
                      {/*tslint:disable-next-line*/}
                      <IconButton
                        color="error"
                        onClick={() => {
                          setIsDeleteDialogOpen(() => true);
                          setRowSelection(() => {
                            const newObject: { [key: string]: boolean } = {};
                            // Setting the selected row to false so that
                            // the row appears unchecked.
                            newObject[
                              row.getValue(`${vehicleType}Id`) as string
                            ] = false;
                            return newObject;
                          });
                        }}
                        disabled={false}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            ),
            []
          )}
          // Render a custom options Bar (inclues search and trash)
          renderTopToolbar={useCallback(
            ({ table }: { table: MRT_TableInstance<VehicleTypes> }) => (
              <Box className="table-container__top-toolbar">
                <MRT_GlobalFilterTextField table={table} />
                {DoesUserHaveRoleWithContext(ROLES.WRITE_VEHICLE) && (
                  <Trash onClickTrash={onClickTrashIcon} disabled={hasNoRowsSelected} />
                )}
              </Box>
            ),
            [hasNoRowsSelected]
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
            maxSize: 200, //allow columns to get larger than default
            minSize: 25,
            size: 50,
          }}
          // Cell/Body container
          muiTableContainerProps={{
            sx: {
              outline: "1px solid #DBDCDC",
              height: "calc(100vh - 475px)",
            },
          }}
          // Pagination
          muiBottomToolbarProps={{
            sx: {
              zIndex: 0, // resolve z-index conflict with sliding panel
              backgroundColor: BC_COLOURS.bc_background_light_grey,
            },
          }}
          // Top toolbar
          muiTopToolbarProps={{ sx: { zIndex: 0 } }} // resolve z-index conflict with sliding panel
          // Alert banner
          muiToolbarAlertBannerProps={
            isError
              ? {
                  color: "error",
                  children: "Error loading data",
                }
              : undefined
          }
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
            sx: { backgroundColor: BC_COLOURS.bc_background_light_grey },
          }}
        />
        <DeleteConfirmationDialog
          onClickDelete={onConfirmDelete}
          isOpen={isDeleteDialogOpen}
          onClickCancel={onCancelDelete}
          caption="item"
        />
      </div>
    );
  }
);

List.displayName = "List";
