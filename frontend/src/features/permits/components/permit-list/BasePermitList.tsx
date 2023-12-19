import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useState } from "react";

import {
  MRT_GlobalFilterTextField,
  MRT_PaginationState,
  MRT_Row,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { SnackBarContext } from "../../../../App";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { FIVE_MINUTES } from "../../../../common/constants/constants";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/constants/defaultTableOptions";
import { getPermits } from "../../apiManager/permitsAPI";
import { Permit } from "../../types/permit";
import { PermitsColumnDefinition } from "./Columns";
import { PermitRowOptions } from "./PermitRowOptions";

/**
 * A permit list component with common functionalities that can be shared by
 * wrapping components.
 */
export const BasePermitList = ({
  isExpired = false,
}: {
  isExpired?: boolean;
}) => {
  const snackBar = useContext(SnackBarContext);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const permitsQuery = useQuery({
    queryKey: ["permits", isExpired, pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getPermits(
        { expired: isExpired },
        { page: pagination.pageIndex, take: pagination.pageSize },
      ),
    keepPreviousData: true,
    staleTime: FIVE_MINUTES,
    retry: 1,
  });

  const { data, isError, isInitialLoading, isLoading } = permitsQuery;

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: PermitsColumnDefinition,
    data: data?.items ?? [],
    enableRowSelection: false,
    initialState: {
      ...defaultTableInitialStateOptions,
      sorting: [{ id: "permitData.startDate", desc: true }],
    },
    state: {
      ...defaultTableStateOptions,
      showAlertBanner: isError,
      showProgressBars: isInitialLoading,
      columnVisibility: { applicationId: true },
      isLoading: isInitialLoading || isLoading,
      pagination,
    },
    renderTopToolbar: useCallback(
      ({ table }: { table: MRT_TableInstance<Permit> }) => (
        <Box
          sx={{
            display: "flex",
            padding: "1.25em 0em",
            backgroundColor: "white",
          }}
        >
          <MRT_GlobalFilterTextField table={table} />
        </Box>
      ),
      [],
    ),
    autoResetPageIndex: false,
    manualPagination: true,
    rowCount: data?.meta?.itemCount ?? 0,
    pageCount: data?.meta?.pageCount ?? 0,
    onPaginationChange: setPagination,
    enablePagination: true,
    enableBottomToolbar: true,
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    renderRowActions: useCallback((props: { row: MRT_Row<Permit> }) => {
      return (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <PermitRowOptions
            isExpired={isExpired}
            permitId={props.row.original.permitId}
          />
        </Box>
      );
    }, []),
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
