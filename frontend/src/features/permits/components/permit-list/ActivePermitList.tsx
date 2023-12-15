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
import { InfoBcGovBanner } from "../../../../common/components/banners/InfoBcGovBanner";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { BANNER_MESSAGES } from "../../../../common/constants/bannerMessages";
import { FIVE_MINUTES } from "../../../../common/constants/constants";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/constants/defaultTableOptions";
import { getPermits } from "../../apiManager/permitsAPI";
import { Permit } from "../../types/permit";
import "./ActivePermitList.scss";
import { PermitsColumnDefinition } from "./Columns";
import { PermitRowOptions } from "./PermitRowOptions";

/**
 * A wrapper with the query to load the table with active permits.
 */
export const ActivePermitList = () => {
  const snackBar = useContext(SnackBarContext);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const activePermitsQuery = useQuery({
    queryKey: ["activePermits", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      getPermits(
        { expired: false },
        { page: pagination.pageIndex, limit: pagination.pageSize },
      ),
    keepPreviousData: true,
    staleTime: FIVE_MINUTES,
    retry: 1,
  });

  const { data, isError, isInitialLoading, isLoading } = activePermitsQuery;

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
          <PermitRowOptions
            isExpired={false}
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

  return (
    <div className="table-container">
      <InfoBcGovBanner msg={BANNER_MESSAGES.PERMIT_REFUND_REQUEST} />
      <MaterialReactTable table={table} />
    </div>
  );
};

ActivePermitList.displayName = "ActivePermitList";
