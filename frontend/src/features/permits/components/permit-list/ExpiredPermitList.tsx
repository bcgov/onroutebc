import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  MRT_PaginationState,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useCallback, useContext, useEffect, useState } from "react";

import { SnackBarContext } from "../../../../App";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { TEN_MINUTES } from "../../../../common/constants/constants";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/constants/defaultTableOptions";
import { getPermits } from "../../apiManager/permitsAPI";
import { Permit } from "../../types/permit";
import { PermitsColumnDefinition } from "./Columns";
import "./ExpiredPermitList.scss";
import { PermitRowOptions } from "./PermitRowOptions";

/**
 * A wrapper with the query to load the table with expired permits.
 */
export const ExpiredPermitList = () => {
  const snackBar = useContext(SnackBarContext);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const expiredPermitsQuery = useQuery({
    queryKey: ["expiredPermits", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getPermits(
        { expired: true },
        { page: pagination.pageIndex, limit: pagination.pageSize },
      ),
    keepPreviousData: true,
    staleTime: TEN_MINUTES,
    retry: 1,
  });
  const { data, isError, isInitialLoading, isLoading } = expiredPermitsQuery;

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
    columns: PermitsColumnDefinition,
    data: data?.items ?? [],
    enableTopToolbar: false,
    enableRowSelection: false,
    initialState: {
      ...defaultTableInitialStateOptions,
      sorting: [{ id: "permitData.expiryDate", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    state: {
      ...defaultTableStateOptions,
      showAlertBanner: isError,
      showProgressBars: isInitialLoading,
      columnVisibility: { applicationId: true },
      isLoading: isInitialLoading || isLoading,
      pagination,
    },
    autoResetPageIndex: false,
    manualPagination: true,
    rowCount: data?.meta?.totalItems ?? 0,
    pageCount: data?.meta?.totalPages ?? 0,
    onPaginationChange: setPagination,
    enablePagination: true,
    enableBottomToolbar: true,
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    renderRowActions: useCallback((props: { row: MRT_Row<Permit> }) => {
      return (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <PermitRowOptions isExpired permitId={props.row.original.permitId} />
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

  return (
    <div className="table-container">
      <MaterialReactTable table={table} />
    </div>
  );
};

ExpiredPermitList.displayName = "ExpiredPermitList";
