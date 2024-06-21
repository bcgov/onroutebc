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
import { PowerUnitColumnDefinition, TrailerColumnDefinition } from "./Columns";
import { SnackBarContext } from "../../../../App";
import { ERROR_ROUTES, VEHICLES_ROUTES } from "../../../../routes/constants";
import { DoesUserHaveRoleWithContext } from "../../../../common/authentication/util";
import { ROLES } from "../../../../common/authentication/types";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { useDeletePowerUnitsMutation, usePowerUnitSubTypesQuery } from "../../hooks/powerUnits";
import { useDeleteTrailersMutation, useTrailerSubTypesQuery } from "../../hooks/trailers";
import {
  Vehicle,
  VehicleType,
  PowerUnit,
  Trailer,
  VEHICLE_TYPES,
} from "../../types/Vehicle";

import {
  defaultTableOptions,
  defaultTableInitialStateOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";

/**
 * Dynamically set the column based on vehicle type
 * @param vehicleType Type of the vehicle
 * @returns An array of column headers/accessor keys for Material React Table
 */
const getColumns = (vehicleType: VehicleType): MRT_ColumnDef<Vehicle>[] => {
  if (vehicleType === VEHICLE_TYPES.POWER_UNIT) {
    return PowerUnitColumnDefinition;
  }
  return TrailerColumnDefinition;
};

/* eslint-disable react/prop-types */
export const List = memo(
  ({
    vehicleType,
    query,
    companyId,
  }: {
    vehicleType: VehicleType;
    query: UseQueryResult<Vehicle[]>;
    companyId: string;
  }) => {
    const navigate = useNavigate();
    const {
      data: vehiclesData,
      isError: fetchVehiclesFailed,
      isFetching: isFetchingVehicles,
      isPending: vehiclesPending,
    } = query;
    
    const columns = useMemo<MRT_ColumnDef<Vehicle>[]>(
      () => getColumns(vehicleType),
      [],
    );

    const snackBar = useContext(SnackBarContext);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const hasNoRowsSelected = Object.keys(rowSelection).length === 0;

    const { data: powerUnitSubtypesData } = usePowerUnitSubTypesQuery();
    const { data: trailerSubtypesData } = useTrailerSubTypesQuery();
    const powerUnitSubTypes = getDefaultRequiredVal([], powerUnitSubtypesData);
    const trailerSubTypes = getDefaultRequiredVal([], trailerSubtypesData);

    const {
      mutateAsync: deletePowerUnits,
      isError: deletePowerUnitsFailed,
    } = useDeletePowerUnitsMutation();

    const {
      mutateAsync: deleteTrailers,
      isError: deleteTrailersFailed,
    } = useDeleteTrailersMutation();

    const colTypeCodes = columns.filter(
      (item) => item.accessorKey === `${vehicleType}TypeCode`,
    );
    const newColumns = columns.filter(
      (item) => item.accessorKey !== `${vehicleType}TypeCode`,
    );

    const transformVehicleCode = (code: string) => {
      const vehicleSubtypesForCode = vehicleType === VEHICLE_TYPES.POWER_UNIT
        ? powerUnitSubTypes.filter(
          (value) => value.typeCode === code,
        ) : trailerSubTypes.filter(
          (value) => value.typeCode === code,
        );
      return getDefaultRequiredVal("", vehicleSubtypesForCode?.at(0)?.type);
    };

    if (colTypeCodes?.length === 1) {
      const colTypeCode = colTypeCodes?.at(0);
      if (colTypeCode) {
        // eslint-disable-next-line react/display-name
        colTypeCode.Cell = ({ cell }) => {
          return <div>{transformVehicleCode(cell.getValue<string>())}</div>;
        };

        const colDate = newColumns?.pop();
        newColumns.push(colTypeCode);
        if (colDate) newColumns.push(colDate);
      }
    }

    const onClickTrashIcon = useCallback(() => {
      setIsDeleteDialogOpen(() => true);
    }, []);

    const handleError = () => {
      setIsDeleteDialogOpen(() => false);
      navigate(ERROR_ROUTES.UNEXPECTED);
    };

    const onConfirmDelete = async () => {
      const vehicleIds = Object.keys(rowSelection);

      try {
        const response = vehicleType === VEHICLE_TYPES.POWER_UNIT
          ? await deletePowerUnits({ companyId, vehicleIds })
          : await deleteTrailers({ companyId, vehicleIds });

        if (response.status === 200) {
          const responseBody = response.data;
          if (responseBody.failure.length > 0) {
            // Delete action for some vehicles failed
            handleError();
          } else {
            setIsDeleteDialogOpen(() => false);
            snackBar.setSnackBar({
              message: "Vehicle Deleted",
              showSnackbar: true,
              setShowSnackbar: () => true,
              alertType: "info",
            });

            setRowSelection(() => {
              return {};
            });
            query.refetch();
          }
        } else {
          handleError();
        }
      } catch {
        handleError();
      }
    };

    const onCancelDelete = useCallback(() => {
      setIsDeleteDialogOpen(() => false);
      setRowSelection(() => {
        return {};
      });
    }, []);

    useEffect(() => {
      if (
        fetchVehiclesFailed
        || deletePowerUnitsFailed
        || deleteTrailersFailed
      ) {
        handleError();
      }
    }, [
      fetchVehiclesFailed,
      deletePowerUnitsFailed,
      deleteTrailersFailed,
      handleError,
    ]);

    const table = useMaterialReactTable({
      ...defaultTableOptions,
      data: getDefaultRequiredVal([], vehiclesData),
      columns: newColumns,
      initialState: {
        ...defaultTableInitialStateOptions,
        sorting: [{ id: "createdDateTime", desc: true }],
      },
      state: {
        ...defaultTableStateOptions,
        isLoading: vehiclesPending,
        showAlertBanner: fetchVehiclesFailed,
        showProgressBars: isFetchingVehicles,
        columnVisibility: { powerUnitId: false, trailerId: false },
        rowSelection,
      },
      getRowId: (originalRow) => {
        if (vehicleType === VEHICLE_TYPES.POWER_UNIT) {
          const powerUnitRow = originalRow as PowerUnit;
          return powerUnitRow.powerUnitId as string;
        } else {
          const trailerRow = originalRow as Trailer;
          return trailerRow.trailerId as string;
        }
      },
      onRowSelectionChange: setRowSelection,
      enableMultiSort: true,
      renderEmptyRowsFallback: () => <NoRecordsFound />,
      renderRowActions: useCallback(
        ({ row }: { row: MRT_Row<Vehicle> }) => (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {DoesUserHaveRoleWithContext(ROLES.WRITE_VEHICLE) && (
              <>
                <Tooltip arrow placement="left" title="Edit">
                  <IconButton
                    onClick={() => {
                      if (vehicleType === VEHICLE_TYPES.POWER_UNIT) {
                        navigate(
                          `${VEHICLES_ROUTES.POWER_UNIT_DETAILS}/${row.getValue(
                            "powerUnitId",
                          )}`,
                        );
                      } else if (vehicleType === VEHICLE_TYPES.TRAILER) {
                        navigate(
                          `${VEHICLES_ROUTES.TRAILER_DETAILS}/${row.getValue(
                            "trailerId",
                          )}`,
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
                        newObject[row.getValue<string>(`${vehicleType}Id`)] =
                          false;
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
        [],
      ),
      // Include search filter and delete button in top toolbar
      renderTopToolbar: useCallback(
        ({ table }: { table: MRT_TableInstance<Vehicle> }) => (
          <Box className="table-container__top-toolbar">
            <MRT_GlobalFilterTextField table={table} />
            {DoesUserHaveRoleWithContext(ROLES.WRITE_VEHICLE) && (
              <TrashButton
                onClickTrash={onClickTrashIcon}
                disabled={hasNoRowsSelected}
              />
            )}
          </Box>
        ),
        [hasNoRowsSelected],
      ),
    });

    return (
      <div className="table-container">
        <MaterialReactTable table={table} />
        <DeleteConfirmationDialog
          onClickDelete={onConfirmDelete}
          isOpen={isDeleteDialogOpen}
          onClickCancel={onCancelDelete}
          caption="item"
        />
      </div>
    );
  },
);

List.displayName = "List";
