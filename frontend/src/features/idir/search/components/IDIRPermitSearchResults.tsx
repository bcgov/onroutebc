import { Box, FormControlLabel, Switch } from "@mui/material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { memo, useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { Optional } from "../../../../common/types/common";
import { USER_ROLE } from "../../../../common/authentication/types";
import { hasPermitExpired } from "../../../permits/helpers/permitState";
import { isPermitInactive } from "../../../permits/types/PermitStatus";
import { PermitListItem } from "../../../permits/types/permit";
import { getPermitDataBySearch } from "../api/idirSearch";
import { PermitSearchResultColumnDef } from "../table/PermitSearchResultColumnDef";
import { PERMIT_ACTION_ORIGINS, SearchFields } from "../types/types";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../common/helpers/tableHelper";
import "./IDIRPermitSearchResults.scss";
import { ERROR_ROUTES } from "../../../../routes/constants";
import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import { httpGETRequest } from "../../../../common/apiManager/httpRequestHandler";
import { useSetCompanyHandler } from "../helpers/useSetCompanyHandler";
import { PermitRowOptions } from "../../../permits/components/permit-list/PermitRowOptions";
import { usePermissionMatrix } from "../../../../common/authentication/PermissionMatrix";

/**
 * Function to decide whether to show row actions icon or not.
 * @param userRole The role of the user.
 * @returns boolean
 */
const shouldShowRowActions = (userRole: Optional<string>): boolean => {
  if (!userRole) return false;
  // Check if the user has PPC role to confirm
  const allowableRoles = [
    USER_ROLE.PPC_CLERK,
    USER_ROLE.ENFORCEMENT_OFFICER,
    USER_ROLE.SYSTEM_ADMINISTRATOR,
    USER_ROLE.FINANCE,
    USER_ROLE.HQ_ADMINISTRATOR,
  ] as string[];
  return allowableRoles.includes(userRole);
};

/*
 *
 * The search results component uses Material React Table (MRT)
 * For detailed documentation, see here:
 * https://www.material-react-table.com/docs/getting-started/usage
 *
 *
 */
export const IDIRPermitSearchResults = memo(
  ({
    searchParams,
  }: {
    /**
     * The search parameters entered by the user.
     */
    searchParams: SearchFields;
  }) => {
    const { searchString, searchByFilter, searchEntity } = searchParams;
    const { idirUserDetails } = useContext(OnRouteBCContext);
    const [isActiveRecordsOnly, setIsActiveRecordsOnly] =
      useState<boolean>(false);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const searchResultsQuery = useQuery({
      queryKey: [
        "search-entity",
        searchString,
        searchByFilter,
        searchEntity,
        pagination.pageIndex,
        pagination.pageSize,
      ],
      queryFn: () =>
        getPermitDataBySearch(
          {
            searchByFilter,
            searchEntity,
            searchString: searchString,
          },
          { page: pagination.pageIndex, take: pagination.pageSize },
        ),
      retry: 1, // retry once.
      enabled: true,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });

    const { data, isPending, isError } = searchResultsQuery;

    const navigate = useNavigate();
    const { handleSelectCompany } = useSetCompanyHandler();
    const fetchCompanyData = async (companyId: number) => {
      const searchURL = new URL(`${VEHICLES_URL}/companies/${companyId}`);
      searchURL.searchParams.set("page", pagination.pageIndex.toString());
      searchURL.searchParams.set("take", pagination.pageSize.toString());
      try {
        const response = await httpGETRequest(searchURL.toString());
        return response.data;
      } catch (err) {
        console.error("Failed to fetch company data", err);
        throw err;
      }
    };

    const handleClickCompany = async (companyId: number) => {
      const company = await fetchCompanyData(companyId);
      handleSelectCompany(company);
    };

    // Column definitions for the table
    const columns = useMemo<MRT_ColumnDef<PermitListItem>[]>(
      () =>
        PermitSearchResultColumnDef(
          () => navigate(ERROR_ROUTES.DOCUMENT_UNAVAILABLE),
          handleClickCompany,
        ),
      [searchEntity, searchByFilter],
    );

    /**
     *
     * @param initialData The initial data to filter by the active data toggle.
     * @returns List of permit items containing the data to be displayed in table.
     */
    const getFilteredData = (
      initialData: PermitListItem[],
    ): PermitListItem[] => {
      if (!initialData.length) return [];
      if (isActiveRecordsOnly) {
        // Returns unexpired permits
        return initialData.filter(
          ({ permitStatus, expiryDate }) =>
            !hasPermitExpired(expiryDate) && !isPermitInactive(permitStatus),
        );
      }
      return initialData;
    };

    const canResendPermit = usePermissionMatrix({
      permissionMatrixKeys: {
        permissionMatrixFeatureKey: "GLOBAL_SEARCH",
        permissionMatrixFunctionKey: "RESEND_PERMIT",
      },
    });

    const canViewPermitReceipt = usePermissionMatrix({
      permissionMatrixKeys: {
        permissionMatrixFeatureKey: "MANAGE_PERMITS",
        permissionMatrixFunctionKey: "VIEW_PERMIT_RECEIPT",
      },
    });

    const canAmendPermit = usePermissionMatrix({
      permissionMatrixKeys: {
        permissionMatrixFeatureKey: "GLOBAL_SEARCH",
        permissionMatrixFunctionKey: "AMEND_PERMIT",
      },
    });

    const canVoidPermit = usePermissionMatrix({
      permissionMatrixKeys: {
        permissionMatrixFeatureKey: "GLOBAL_SEARCH",
        permissionMatrixFunctionKey: "VOID_PERMIT",
      },
    });

    const table = useMaterialReactTable({
      ...defaultTableOptions,
      data: getFilteredData(data?.items ?? []),
      columns: columns,
      initialState: {
        ...defaultTableInitialStateOptions,
        sorting: [{ id: "permitIssueDateTime", desc: true }],
      },
      state: {
        ...defaultTableStateOptions,
        isLoading: isPending,
        showAlertBanner: isError,
        showProgressBars: isPending,
        pagination,
      },
      autoResetPageIndex: false,
      manualPagination: true,
      rowCount: data?.meta?.totalItems ?? 0,
      pageCount: data?.meta?.pageCount ?? 0,
      onPaginationChange: setPagination,
      enablePagination: true,
      enableTopToolbar: true,
      enableBottomToolbar: true,
      enableRowSelection: false,
      enableGlobalFilter: false,
      renderToolbarInternalActions: () => (
        <div className="toolbar-internal"></div>
      ),
      renderTopToolbarCustomActions: () => {
        return (
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <FormControlLabel
              value="end"
              control={
                <Switch
                  color="primary"
                  checked={isActiveRecordsOnly}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setIsActiveRecordsOnly(() => event.target.checked);
                  }}
                />
              }
              label="Active Permits Only"
              labelPlacement="end"
            />
          </Box>
        );
      },
      renderRowActions: useCallback(
        ({ row }: { row: MRT_Row<PermitListItem> }) => {
          const isInactive =
            hasPermitExpired(row.original.expiryDate) ||
            isPermitInactive(row.original.permitStatus);

          if (shouldShowRowActions(idirUserDetails?.userRole)) {
            return (
              <Box className="idir-search-results__row-actions">
                <PermitRowOptions
                  isPermitInactive={isInactive}
                  permitNumber={row.original.permitNumber}
                  permitId={row.original.permitId}
                  companyId={row.original.companyId}
                  permitActionOrigin={PERMIT_ACTION_ORIGINS.GLOBAL_SEARCH}
                  permissions={{
                    canAmendPermit,
                    canResendPermit,
                    canViewPermitReceipt,
                    canVoidPermit,
                  }}
                />
              </Box>
            );
          } else {
            return <></>;
          }
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

    return (
      <div className="table-container idir-search-results">
        <MaterialReactTable table={table} />
      </div>
    );
  },
);

IDIRPermitSearchResults.displayName = "SearchResults";
