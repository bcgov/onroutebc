import { Box } from "@mui/material";
import { useCallback, useContext, useEffect } from "react";
import { UseQueryResult } from "@tanstack/react-query";

import {
  MRT_GlobalFilterTextField,
  MRT_Row,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { SnackBarContext } from "../../../../App";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { Permit } from "../../types/permit";
import { PermitsColumnDefinition } from "./Columns";
import { PermitRowOptions } from "./PermitRowOptions";
import { defaultTableInitialStateOptions, defaultTableOptions, defaultTableStateOptions } from "../../../../common/constants/defaultTableOptions";

/**
 * A permit list component with common functionalities that can be shared by
 * wrapping components.
 */
export const BasePermitList = ({
  query,
  isExpired = false,
}: {
  query: UseQueryResult<Permit[]>;
  isExpired?: boolean;
}) => {
  const { data, isError, isInitialLoading } = query;
  const snackBar = useContext(SnackBarContext);

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: PermitsColumnDefinition,
    data: data ?? [],
    initialState: {
      ...defaultTableInitialStateOptions,
      sorting: [{ id: "permitData.expiryDate", desc: true }],
    },
    state: {
      ...defaultTableStateOptions,
      showAlertBanner: isError,
      showProgressBars: isInitialLoading,
      columnVisibility: { applicationId: true },
      isLoading: isInitialLoading,
    },
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    renderRowActions: useCallback(
      ({ row }: { table: MRT_TableInstance<Permit>; row: MRT_Row<Permit> }) => {
        return (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <PermitRowOptions
              isExpired={isExpired}
              permitId={row.original.permitId}
            />
          </Box>
        );
      },
      [],
    ),
    renderTopToolbar: useCallback(
      ({ table }: { table: MRT_TableInstance<Permit> }) => (
        <Box
          sx={{
            display: "flex",
            padding: "20px 0px",
            backgroundColor: "white",
          }}
        >
          <MRT_GlobalFilterTextField table={table} />
        </Box>
      ),
      [],
    ),
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
  });

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

  return <MaterialReactTable table={table} />;
};
