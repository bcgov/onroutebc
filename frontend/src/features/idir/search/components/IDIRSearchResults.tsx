import { Box, FormControlLabel, Switch } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { memo, useCallback, useContext, useMemo, useState } from "react";

import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable 
} from 'material-react-table'

import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { hasPermitExpired } from "../../../permits/helpers/permitPDFHelper";
import { Permit } from "../../../permits/types/permit";
import { getDataBySearch } from "../api/idirSearch";
import { PermitSearchResultColumnDef } from "../table/Columns";
import { SearchFields } from "../types/types";
import { IDIRPermitSearchRowActions } from "./IDIRPermitSearchRowActions";
import "./List.scss";
import { USER_AUTH_GROUP } from "../../../manageProfile/types/userManagement.d";
import { isPermitInactive } from "../../../permits/types/PermitStatus";

/**
 * Function to decide whether to show row actions icon or not.
 * @param userAuthGroup The auth group the user belongs to.
 * @returns boolean
 */
const shouldShowRowActions = (userAuthGroup: string | undefined): boolean => {
  if (!userAuthGroup) return false;
  // Check if the user has PPC role to confirm
  const allowableAuthGroups = [
    USER_AUTH_GROUP.PPCCLERK,
    USER_AUTH_GROUP.EOFFICER,
    USER_AUTH_GROUP.SYSADMIN,
  ] as string[];
  return allowableAuthGroups.includes(userAuthGroup);
};

/*
 *
 * The search results component uses Material React Table (MRT)
 * For detailed documentation, see here:
 * https://www.material-react-table.com/docs/getting-started/usage
 *
 *
 */
export const IDIRSearchResults = memo(
  ({
    searchParams,
  }: {
    /**
     * The search parameters entered by the user.
     */
    searchParams: SearchFields;
  }) => {
    const { searchValue, searchByFilter, searchEntity } = searchParams;
    const { idirUserDetails } = useContext(OnRouteBCContext);
    const [isActiveRecordsOnly, setIsActiveRecordsOnly] =
      useState<boolean>(false);

    const { data, isLoading, isError } = useQuery(
      ["search-entity", searchValue, searchByFilter, searchEntity],
      () =>
        getDataBySearch({
          searchByFilter,
          searchEntity,
          searchValue,
        }),
      { retry: false, enabled: true, refetchInterval: false },
    );

    // Column definitions for the table
    const columns = useMemo<MRT_ColumnDef<Permit>[]>(
      () => PermitSearchResultColumnDef,
      [],
    );

    /**
     *
     * @param initialData The initial data to filter by the active data toggle.
     * @returns Permit[] containing the data to be displayed in table.
     */
    const getFilteredData = (initialData: Permit[]): Permit[] => {
      if (!initialData.length) return [];
      if (isActiveRecordsOnly) {
        // Returns unexpired permits
        return initialData.filter(
          ({ permitStatus, permitData: { expiryDate } }) =>
            !hasPermitExpired(expiryDate) && !isPermitInactive(permitStatus),
        );
      }
      return initialData;
    };
    
    const table = useMaterialReactTable({
      data: getFilteredData(data?.items ?? []),
      columns: columns,
      enableTopToolbar: true,
      renderToolbarInternalActions: () => <></>,
      renderTopToolbarCustomActions: () => {
        return (
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <FormControlLabel
              value="end"
              control={
                <Switch
                  color="primary"
                  checked={isActiveRecordsOnly}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>,
                  ) => {
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
      initialState: {
        sorting: [{ id: "permitIssueDateTime", desc: true }],
      },
      state: {
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isLoading
      },
      enableColumnActions: false,
      enableRowActions: true,
      selectAllMode: "page",
      enableStickyHeader: true,
      positionActionsColumn: "last",
      displayColumnDefOptions: {
        "mrt-row-actions": {
          header: "",
        },
      },
      renderRowActions: useCallback(
        ({
          row,
        }: {
          table: MRT_TableInstance<Permit>;
          row: MRT_Row<Permit>;
        }) => {
          const isInactive =
            hasPermitExpired(row.original.permitData.expiryDate) ||
            isPermitInactive(row.original.permitStatus);

          if (shouldShowRowActions(idirUserDetails?.userAuthGroup)) {
            return (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IDIRPermitSearchRowActions
                  isPermitInactive={isInactive}
                  permitNumber={row.original.permitNumber}
                  permitId={row.original.permitId}
                  userAuthGroup={idirUserDetails?.userAuthGroup}
                />
              </Box>
            );
          } else {
            return <></>;
          }
        },
        [],
      ),
      muiTablePaperProps: {
        sx: {
          border: "none",
          boxShadow: "none",
        },
      },
      defaultColumn: {
        maxSize: 200, //allow columns to get larger than default
        minSize: 25,
        size: 50,
      },
      muiTableContainerProps: {
        sx: {
          outline: "1px solid #DBDCDC",
          height: "calc(100vh - 475px)",
        },
      },
      muiBottomToolbarProps: {
        sx: {
          zIndex: 0, // resolve z-index conflict with sliding panel
          backgroundColor: BC_COLOURS.bc_background_light_grey,
        },
      },
      muiTopToolbarProps: { sx: { zIndex: 0 } }, // resolve z-index conflict with sliding panel
      muiToolbarAlertBannerProps:
        isError
          ? {
              color: "error",
              children: "Error loading data",
            }
          : undefined
      ,
      muiSearchTextFieldProps: {
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
      },
      muiTableHeadRowProps: {
        sx: { backgroundColor: BC_COLOURS.bc_background_light_grey },
      }

    })

    return (
      <div className="table-container">
        <MaterialReactTable table={table} />
      </div>
    )
  },
);

    /*
    return (
      <div className="table-container">
        <MaterialReactTable
          // Required Props
          data={getFilteredData(data?.items ?? [])}
          columns={columns}
          enableTopToolbar={true}
          // Empty Toolbar actions to prevent the default actions.
          renderToolbarInternalActions={() => <></>}
          renderTopToolbarCustomActions={() => {
            return (
              <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
                <FormControlLabel
                  value="end"
                  control={
                    <Switch
                      color="primary"
                      checked={isActiveRecordsOnly}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setIsActiveRecordsOnly(() => event.target.checked);
                      }}
                    />
                  }
                  label="Active Permits Only"
                  labelPlacement="end"
                />
              </Box>
            );
          }}
          initialState={{
            sorting: [{ id: "permitIssueDateTime", desc: true }],
          }}
          state={{
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isLoading
          }}
          // Disable the default column actions so that we can use our custom actions
          enableColumnActions={false}
          enableRowActions={true}
          selectAllMode="page"
          enableStickyHeader
          positionActionsColumn="last"
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
              const isInactive =
                hasPermitExpired(row.original.permitData.expiryDate) ||
                isPermitInactive(row.original.permitStatus);

              if (shouldShowRowActions(idirUserDetails?.userAuthGroup)) {
                return (
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IDIRPermitSearchRowActions
                      isPermitInactive={isInactive}
                      permitNumber={row.original.permitNumber}
                      permitId={row.original.permitId}
                      userAuthGroup={idirUserDetails?.userAuthGroup}
                    />
                  </Box>
                );
              } else {
                return <></>;
              }
            },
            [],
          )}
          
          // Main table container
          muiTablePaperProps={{
            sx: {
              border: "none",
              boxShadow: "none",
            },
          }}
          // Column widths
          defaultColumn={{
            maxSize: 200, //allow columns to get larger than default
            minSize: 25,
            size: 50,
          }}
          // Cell/Body container
          muiTableContainerProps={{
            sx: {
              outline: "1px solid #DBDCDC",
              height: "calc(100vh - 475px)",
            },
          }}
          // Pagination
          muiBottomToolbarProps={{
            sx: {
              zIndex: 0, // resolve z-index conflict with sliding panel
              backgroundColor: BC_COLOURS.bc_background_light_grey,
            },
          }}
          // Top toolbar
          muiTopToolbarProps={{ sx: { zIndex: 0 } }} // resolve z-index conflict with sliding panel
          // Alert banner
          muiToolbarAlertBannerProps={
            isError
              ? {
                  color: "error",
                  children: "Error loading data",
                }
              : undefined
          }
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
            sx: { backgroundColor: BC_COLOURS.bc_background_light_grey },
          }}
        />
      </div>
    );
  },
);
*/

IDIRSearchResults.displayName = "SearchResults";
