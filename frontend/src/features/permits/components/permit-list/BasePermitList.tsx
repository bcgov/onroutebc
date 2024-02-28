import { Box } from "@mui/material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

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
import { Permit } from "../../types/permit";
import { PermitsColumnDefinition } from "./Columns";
import { PermitRowOptions } from "./PermitRowOptions";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import { useNavigate } from "react-router-dom";
import { ERROR_ROUTES } from "../../../../routes/constants";
import { CustomActionLink } from "../../../../common/components/links/CustomActionLink";
import { PermitChip } from "./PermitChip";
import { openBlobInNewTab } from "../../helpers/permitPDFHelper";

/**
 * A permit list component with common functionalities that can be shared by
 * wrapping components.
 */
export const BasePermitList = ({
  isExpired = false,
}: {
  isExpired?: boolean;
}) => {
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
  });

  const worker: Worker = useMemo(
    () => new Worker(new URL("./Worker.js", import.meta.url), { type: "module"}),
    [],
  );

  useEffect(() => {
    if (window.Worker) {
      worker.onmessage = (e: MessageEvent<Blob>) => {
        openBlobInNewTab(e.data);
      };
    }
  }, [worker]);

  const { data, isError, isPending, isRefetching } = permitsQuery;

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: [
      {
        accessorKey: "permitNumber",
        id: "permitNumber",
        header: "Permit #",
        enableSorting: true,
        size: 500,
        accessorFn: (row) => row.permitNumber,
        Cell: (props: { row: any; cell: any }) => {
          return (
            <>
              <CustomActionLink
                onClick={() => {
                  console.log(
                    "props.row.original.permitId::",
                    props.row.original.permitId,
                  );
                  worker.postMessage(props.row.original.permitId);
                }}
              >
                {props.cell.getValue()}
              </CustomActionLink>
              <PermitChip permitStatus={props.row.original.permitStatus} />
            </>
          );
        },
      },
      ...PermitsColumnDefinition,
    ],
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
      navigate(ERROR_ROUTES.UNEXPECTED);
    }
  }, [isError]);

  return <MaterialReactTable table={table} />;
};
