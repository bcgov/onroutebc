import { Box } from "@mui/material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useState } from "react";

import {
  MRT_GlobalFilterTextField,
  MRT_PaginationState,
  MRT_Row,
  MRT_SortingState,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { getPermits } from "../../apiManager/permitsAPI";
import { PermitListItem } from "../../types/permit";
import { PermitsColumnDefinition } from "./Columns";
import { useNavigate } from "react-router-dom";
import { ERROR_ROUTES } from "../../../../routes/constants";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import { hasPermitExpired } from "../../helpers/permitState";
import { isPermitInactive } from "../../types/PermitStatus";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { applyWhenNotNullable } from "../../../../common/helpers/util";
import { PERMIT_ACTION_ORIGINS } from "../../../idir/search/types/types";
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
  const { companyId: companyIdFromContext } = useContext(OnRouteBCContext);

  const companyId: number = applyWhenNotNullable(
    (id) => Number(id),
    companyIdFromContext,
    0,
  );

  const navigate = useNavigate();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<MRT_SortingState>([
    {
      id: "startDate",
      desc: true,
    },
  ]);

  const permitsQuery = useQuery({
    queryKey: [
      "permits",
      isExpired,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: () =>
      getPermits(
        companyId,
        { expired: isExpired },
        {
          page: pagination.pageIndex,
          take: pagination.pageSize,
          searchString: globalFilter,
          orderBy:
            sorting.length > 0
              ? [
                  {
                    column: sorting.at(0)?.id as string,
                    descending: Boolean(sorting.at(0)?.desc),
                  },
                ]
              : [],
        },
      ),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: Boolean(companyId),
  });

  const { data, isError, isPending, isRefetching } = permitsQuery;

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: PermitsColumnDefinition(() =>
      navigate(ERROR_ROUTES.DOCUMENT_UNAVAILABLE),
    ),
    data: data?.items ?? [],
    enableRowSelection: false,
    initialState: {
      ...defaultTableInitialStateOptions,
      sorting: [{ id: "startDate", desc: true }],
    },
    state: {
      ...defaultTableStateOptions,
      showAlertBanner: isError,
      columnVisibility: { applicationId: true },
      isLoading: isPending || isRefetching,
      pagination,
      globalFilter,
      sorting,
    },
    renderTopToolbar: useCallback(
      ({ table }: { table: MRT_TableInstance<PermitListItem> }) => (
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
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiSearchTextFieldProps: {
      ...defaultTableOptions.muiSearchTextFieldProps,
      helperText: globalFilter?.length >= 100 && "100 characters maximum.",
    },
    rowCount: data?.meta?.totalItems ?? 0,
    pageCount: data?.meta?.pageCount ?? 0,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    enablePagination: true,
    enableBottomToolbar: true,
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    renderRowActions: useCallback(
      ({ row }: { row: MRT_Row<PermitListItem> }) => {
        const isInactive =
          hasPermitExpired(row.original.expiryDate) ||
          isPermitInactive(row.original.permitStatus);
        return (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <PermitRowOptions
              isPermitInactive={isInactive}
              permitNumber={row.original.permitNumber}
              permitId={row.original.permitId}
              companyId={row.original.companyId}
              permitActionOrigin={PERMIT_ACTION_ORIGINS.ACTIVE_PERMITS}
            />
          </Box>
        );
      },
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
      navigate(ERROR_ROUTES.UNEXPECTED);
    }
  }, [isError]);

  return <MaterialReactTable table={table} />;
};
