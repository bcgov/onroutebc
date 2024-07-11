import { useCallback, useMemo } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import "./LOAList.scss";
import { LOADetail } from "../../../../types/SpecialAuthorization";
import { DATE_FORMATS, toLocal } from "../../../../../../common/helpers/formatDate";
import { applyWhenNotNullable } from "../../../../../../common/helpers/util";
import { CustomActionLink } from "../../../../../../common/components/links/CustomActionLink";
import {
  defaultTableInitialStateOptions,
  defaultTableOptions,
  defaultTableStateOptions,
} from "../../../../../../common/helpers/tableHelper";

export const LOAList = ({
  loas,
  isActive,
  allowEditLOA,
  onEdit,
  onDelete,
  onDownload,
}: {
  loas: LOADetail[];
  isActive: boolean;
  allowEditLOA: boolean;
  onEdit: (loaId: string) => void;
  onDelete?: (loaId: string) => void;
  onDownload: (loaId: string) => void;
}) => {
  const handleEditLOA = (loaId: string) => {
    if (!allowEditLOA) return;
    onEdit(loaId);
  };

  const columns = useMemo<MRT_ColumnDef<LOADetail>[]>(
    () => [
      {
        Cell: (
          props: { cell: any; row: any }
        ) => {
          const loaId = `${props.row.original.loaId}`;
          const loaNumber = `${props.row.original.loaNumber}`;
          return allowEditLOA ? (
            <CustomActionLink
              className="loa-list__link loa-list__link--edit-loa"
              onClick={() => handleEditLOA(loaId)}
            >
              {loaNumber}
            </CustomActionLink>
          ) : (
            <>{loaNumber}</>
          );
        },
        accessorKey: "loaNumber",
        header: "LOA #",
        muiTableHeadCellProps: {
          className:
            "loa-list__header loa-list__header--number",
        },
        muiTableBodyCellProps: {
          className:
            "loa-list__data loa-list__data--number",
        },
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorFn: (originalRow) => {
          return toLocal(originalRow.startDate, DATE_FORMATS.DATEONLY_SLASH);
        },
        id: "startDate",
        header: "Start Date",
        muiTableHeadCellProps: {
          className:
            "loa-list__header loa-list__header--start",
        },
        muiTableBodyCellProps: {
          className:
            "loa-list__data loa-list__data--start",
        },
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorFn: (originalRow) =>
          applyWhenNotNullable(
            (expiryDate) => toLocal(expiryDate, DATE_FORMATS.DATEONLY_SLASH),
            originalRow.expiryDate,
            "Never expires",
          ) as string,
        id: "expiryDate",
        header: "Expiry Date",
        muiTableHeadCellProps: {
          className:
            "loa-list__header loa-list__header--expiry",
        },
        muiTableBodyCellProps: {
          className:
            "loa-list__data loa-list__data--expiry",
        },
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        Cell: (
          props: { cell: any; row: any }
        ) => {
          const loaId = `${props.row.original.loaId}`;

          return (
            <CustomActionLink
              className="loa-list__link loa-list__link--download-loa"
              onClick={() => onDownload(loaId)}
            >
              Download Letter
            </CustomActionLink>
          );
        },
        header: "",
        muiTableHeadCellProps: {
          className:
            "loa-list__header loa-list__header--download",
        },
        muiTableBodyCellProps: {
          className:
            "loa-list__data loa-list__data--download",
        },
        accessorKey: "documentId",
        enableSorting: false,
        enableColumnActions: false,
      },
    ],
    [allowEditLOA],
  );

  const table = useMaterialReactTable({
    ...defaultTableOptions,
    columns: columns,
    data: loas,
    enableRowActions: isActive,
    renderRowActions: useCallback(
      ({
        row,
      }: {
        table: MRT_TableInstance<LOADetail>;
        row: MRT_Row<LOADetail>;
      }) => isActive && allowEditLOA ? (
        <div className="loa-list__row-actions">
          <Tooltip arrow placement="top" title="Delete">
            <IconButton
              classes={{
                root: "loa-list__delete-btn",
              }}
              onClick={() => {
                if (!isActive) return;
                onDelete?.(row.original.loaId);
              }}
              disabled={false}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </IconButton>
          </Tooltip>
        </div>
      ) : null,
      [isActive, allowEditLOA],
    ),
    enableGlobalFilter: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableRowSelection: false,
    initialState: {
      ...defaultTableInitialStateOptions,
      showGlobalFilter: false,
    },
    state: {
      ...defaultTableStateOptions,
    },
    muiTablePaperProps: {
      className: "loa-list",
    },
    muiTableContainerProps: {
      className: "loa-list__table",
    },
  });

  return <MaterialReactTable table={table} />;
};
