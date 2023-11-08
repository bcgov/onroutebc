import { Box } from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";
import MaterialReactTable, {
  MRT_GlobalFilterTextField,
  MRT_Row,
  MRT_TableInstance
} from "material-react-table";
import { useCallback, useContext, useEffect } from "react";

import { SnackBarContext } from "../../../../App";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import "../../../manageVehicles/components/list/List.scss";
import { Permit } from "../../types/permit";
import { PermitsColumnDefinition } from "./Columns";
import { PermitRowOptions } from "./PermitRowOptions";

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

  return (
    <MaterialReactTable
      columns={PermitsColumnDefinition}
      data={data ?? []}
      state={{
        showAlertBanner: isError,
        showProgressBars: isInitialLoading,
        columnVisibility: { applicationId: true },
        isLoading: isInitialLoading,
      }}
      renderEmptyRowsFallback={() => <NoRecordsFound />}
      selectAllMode="page"
      enableStickyHeader
      positionActionsColumn="last"
      // Disable the default column actions so that we can use our custom actions
      enableColumnActions={false}
      enableRowActions={true}
      displayColumnDefOptions={{
        "mrt-row-actions": {
          header: "",
        },
      }}
      renderRowActions={useCallback(
        ({
          row,
        }: {
          table: MRT_TableInstance<Permit>;
          row: MRT_Row<Permit>;
        }) => {
          return (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <PermitRowOptions
                isExpired={isExpired}
                permitId={row.original.permitId}
              />
            </Box>
          );
        },
        []
      )}
      renderTopToolbar={useCallback(
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
          boxShadow: "none"
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
          backgroundColor: BC_COLOURS.bc_background_light_grey,
        },
      }}
    />
  );
};
