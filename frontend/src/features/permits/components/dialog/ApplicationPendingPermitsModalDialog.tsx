import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Button, Typography } from "@mui/material";
import "./ApplicationPendingPermitsModalDialog.scss";
import { InfoBcGovBanner } from "../../../../common/components/banners/InfoBcGovBanner";
import { MRT_ColumnDef, MRT_PaginationState, MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { NoRecordsFound } from "../../../../common/components/table/NoRecordsFound";
import { useContext, useMemo, useState } from "react";
import { ApplicationListItem } from "../../types/application";
import { ApplicationPendingPermitsModalColumnDefinition } from "./ApplicationPendingPermitsModalColumnDefinition";
import { getDefaultNullableVal } from "../../../../common/helpers/util";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { defaultTableInitialStateOptions, defaultTableOptions } from "../../../../common/helpers/tableHelper";
import { useApplicationsInProgressQuery } from "../../hooks/hooks";
import { PPC_EMAIL, TOLL_FREE_NUMBER } from "../../../../common/constants/constants";

/**
 * Dynamically set the column
 * @returns An array of column headers/accessor keys for Material React Table
 */
const getColumns = (): MRT_ColumnDef<ApplicationListItem>[] => {
    return ApplicationPendingPermitsModalColumnDefinition();
  };

export const ApplicationPendingPermitsModalDialog = ({
    showModal,
    onCancel,
  }: {
    showModal: boolean;
    onCancel: () => void;
  }) => {

    const [pagination, setPagination] = useState<MRT_PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    
    const applicationPermitsPendingQuery = useApplicationsInProgressQuery({
      page: pagination.pageIndex,
      take: pagination.pageSize,
      pendingPermits: true,
    });
    
    const { data } = applicationPermitsPendingQuery;
    const handleCancel = () => onCancel();
    const { userDetails } = useContext(OnRouteBCContext);
    const userAuthGroup = getDefaultNullableVal(
        userDetails?.userAuthGroup,
    );
    const columns = useMemo<MRT_ColumnDef<ApplicationListItem>[]>(
        () => getColumns(),
        [userAuthGroup],
    );

    const table = useMaterialReactTable({
        ...defaultTableOptions,
        columns: columns,
        data: data?.items ?? [],
        initialState: {
            ...defaultTableInitialStateOptions,
            showGlobalFilter: false,
        },
        state: {
          pagination,
        },
        enableGlobalFilter: false,
        enableTopToolbar: false,
        enableRowSelection: false,
        autoResetPageIndex: false,
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        rowCount: data?.meta?.totalItems ?? 0,
        pageCount: data?.meta?.pageCount ?? 0,
        onPaginationChange: setPagination,
        enablePagination: true,
        enableBottomToolbar: true,
        renderEmptyRowsFallback: () => <NoRecordsFound />,
        muiTableContainerProps: {
            sx: {
              outline: "1px solid #DBDCDC",
              width: "100%"
            },
        },
    });
  
    return (
      <Dialog
        className="pending-permits-modal"
        open={showModal}
        onClose={handleCancel}
        PaperProps={{
          className: "pending-permits-modal__container"
        }}
      >
        <div className="pending-permits-modal__header">
          <div className="pending-permits-modal__icon">
            <FontAwesomeIcon className="icon" icon={faExclamationTriangle} />
          </div>
  
          <span className="pending-permits-modal__title">
            Pending Permits
          </span>
        </div>
  
        <div className="pending-permits-modal__body">
            <p>You have {data?.items?.length} Pending Permits</p>
            <InfoBcGovBanner
                className="pending-permits-modal__banner" 
                msg={"There was an unexpected error in issuing the following permits. No action from you is required."}
                additionalInfo={
                    <Typography sx={{ marginBottom: "8px" }}>
                    onRouteBC will keep trying to issue these permits once the error is resolved. If
                    you need immediate assistance, please contact the Provincial Permit Centre at
                    {" "}
                    <span>
                        <strong>Toll-free: {TOLL_FREE_NUMBER}</strong>
                    </span> or {" "}
                    <span>
                        <strong>Email: {PPC_EMAIL}</strong>
                    </span>
                    </Typography>
                }
            />
            <div className="table-container">
                <MaterialReactTable table={table} />
            </div>
        </div>

        <div className="pending-permits-modal__footer">
        <Button
            key="cancel-pending-permits-button"
            aria-label="Cancel"
            variant="contained"
            color="tertiary"
            className="pending-permits-button pending-permits-button--cancel"
            onClick={handleCancel}
            data-testid="cancel-pending-permits-button"
        >
            Cancel
        </Button>
        </div>
      </Dialog>
    );
  };
  