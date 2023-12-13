import { useQuery } from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  MRT_PaginationState,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import "./ActivePermitList.scss";
import { InfoBcGovBanner } from "../../../../common/components/banners/InfoBcGovBanner";
import { FIVE_MINUTES } from "../../../../common/constants/constants";
import { getPermits } from "../../apiManager/permitsAPI";
import { BANNER_MESSAGES } from "../../../../common/constants/bannerMessages";
import { Permit } from "../../types/permit";
import { PaginatedResponse } from "../../../../common/types/common";
import { SnackBarContext } from "../../../../App";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { PermitRowOptions } from "./PermitRowOptions";
import { PermitsColumnDefinition } from "./Columns";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/constants/defaultTableOptions";

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
    queryKey: ["activePermits", pagination.pageIndex],
    queryFn: () => getPermits({ page: pagination.pageIndex + 1 }),
    keepPreviousData: true,
    staleTime: FIVE_MINUTES,
    retry: 1,
  });

  const { data, isError, isInitialLoading, isLoading } = activePermitsQuery;

  console.log('data::', data);
  console.log('pagination::', pagination);
  console.log('pageIndex from API::', data?.meta?.currentPage ?? 1);

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
