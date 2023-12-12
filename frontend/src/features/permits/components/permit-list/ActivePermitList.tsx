import { useQuery } from "@tanstack/react-query";

import "./ActivePermitList.scss";
import { InfoBcGovBanner } from "../../../../common/components/banners/InfoBcGovBanner";
import { FIVE_MINUTES } from "../../../../common/constants/constants";
import { getPermits } from "../../apiManager/permitsAPI";
import { BasePermitList } from "./BasePermitList";
import { BANNER_MESSAGES } from "../../../../common/constants/bannerMessages";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  MRT_PaginationState,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Permit } from "../../types/permit";
import { PaginatedResponse } from "../../../../common/types/common";
import { SnackBarContext } from "../../../../App";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/constants/defaultTableOptions";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { Box } from "@mui/material";
import { PermitRowOptions } from "./PermitRowOptions";
import { PermitsColumnDefinition } from "./Columns";

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
    queryFn: () => getPermits({ page: pagination.pageIndex }),
    keepPreviousData: true,
    staleTime: FIVE_MINUTES,
  });

  const { data, isError, isInitialLoading, isLoading } = activePermitsQuery;
  const {
    meta: { totalItems, totalPages },
  } = data as PaginatedResponse<Permit>;

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
    data: data ?? [],
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
    rowCount: totalItems,
    pageCount: totalPages,
    onPaginationChange: setPagination,
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
