import { useContext, useMemo } from "react";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Button, Typography } from "@mui/material";
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import "./PendingPermitsDialog.scss";
import { InfoBcGovBanner } from "../../../../../common/components/banners/InfoBcGovBanner";
import { NoRecordsFound } from "../../../../../common/components/table/NoRecordsFound";
import { ApplicationListItem } from "../../../types/application";
import { PendingPermitsColumnDefinition } from "./PendingPermitsColumnDefinition";
import OnRouteBCContext from "../../../../../common/authentication/OnRouteBCContext";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
} from "../../../../../common/helpers/tableHelper";
import {
  PPC_EMAIL,
  TOLL_FREE_NUMBER,
} from "../../../../../common/constants/constants";
import {
  Optional,
  PaginatedResponse,
} from "../../../../../common/types/common";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";

/**
 * Dynamically set the column
 * @returns An array of column headers/accessor keys for Material React Table
 */
const getColumns = (): MRT_ColumnDef<ApplicationListItem>[] => {
  return PendingPermitsColumnDefinition;
};

export const PendingPermitsDialog = ({
  showModal,
  onCancel,
  pendingPermits,
  pagination,
  setPagination,
}: {
  showModal: boolean;
  onCancel: () => void;
  pendingPermits: Optional<PaginatedResponse<ApplicationListItem>>;
  pagination: MRT_PaginationState;
  setPagination: (pagination: MRT_PaginationState) => void;
}) => {
  const handleCancel = () => onCancel();
  const { userDetails } = useContext(OnRouteBCContext);
  const userAuthGroup = userDetails?.userRole;

  const columns = useMemo<MRT_ColumnDef<ApplicationListItem>[]>(
    () => getColumns(),
    [userAuthGroup],
  );

  const pendingCount = getDefaultRequiredVal(
    0,
    pendingPermits?.meta?.totalItems,
  );
  const pendingMsg = `You have ${pendingCount} Pending Permit${pendingCount === 1 ? "" : "s"}`;

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: columns,
    data: getDefaultRequiredVal([], pendingPermits?.items),
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
    enableRowActions: false,
    autoResetPageIndex: false,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    rowCount: pendingCount,
    pageCount: getDefaultRequiredVal(0, pendingPermits?.meta?.pageCount),
    onPaginationChange: setPagination,
    enablePagination: true,
    enableBottomToolbar: true,
    renderEmptyRowsFallback: () => <NoRecordsFound />,
    muiTablePaperProps: {
      className: "pending-permits-dialog__table-container",
    },
  });

  return (
    <Dialog
      className="pending-permits-dialog"
      open={showModal}
      onClose={handleCancel}
      PaperProps={{
        className: "pending-permits-dialog__container",
      }}
    >
      <div className="pending-permits-dialog__header">
        <div className="pending-permits-dialog__icon">
          <FontAwesomeIcon className="icon" icon={faExclamationTriangle} />
        </div>

        <span className="pending-permits-dialog__title">Pending Permits</span>
      </div>

      <div className="pending-permits-dialog__body">
        <p className="pending-permits-dialog__msg">{pendingMsg}</p>

        <InfoBcGovBanner
          className="pending-permits-dialog__banner"
          msg={
            "There was an unexpected error in issuing the following permits. No action from you is required."
          }
          additionalInfo={
            <Typography sx={{ marginBottom: "8px" }}>
              onRouteBC will keep trying to issue these permits once the error
              is resolved. If you need immediate assistance, please contact the
              Provincial Permit Centre at{" "}
              <span>
                <strong>Toll-free: {TOLL_FREE_NUMBER}</strong>
              </span>{" "}
              or{" "}
              <span>
                <strong>Email: {PPC_EMAIL}</strong>
              </span>
            </Typography>
          }
        />

        <MaterialReactTable table={table} />
      </div>

      <div className="pending-permits-dialog__footer">
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
