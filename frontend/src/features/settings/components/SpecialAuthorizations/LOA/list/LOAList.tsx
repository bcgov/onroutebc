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
import { LOA } from "../../../../types/SpecialAuthorization";
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
}: {
  loas: LOA[];
  isActive: boolean;
}) => {
  const handleEditLOA = (loaNumber: string) => {
    console.log(`Edit LOA ${loaNumber}`); //
  };

  const handleDownloadLOA = (documentId: number | string) => {
    console.log(`Download document ${documentId}`); //
  };

  const columns = useMemo<MRT_ColumnDef<LOA>[]>(
    () => [
      {
        Cell: (
          props: { cell: any; row: any }
        ) => {
          const loaNumber = `${props.row.original.loaNumber}`;
          return (
            <CustomActionLink
              className="loa-list__link loa-list__link--edit-loa"
              onClick={() => handleEditLOA(loaNumber)}
            >
              {loaNumber}
            </CustomActionLink>
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
          const documentId = `${props.row.original.documentId}`;

          return (
            <CustomActionLink
              className="loa-list__link loa-list__link--download-loa"
              onClick={() => handleDownloadLOA(documentId)}
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
    [],
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
        table: MRT_TableInstance<LOA>;
        row: MRT_Row<LOA>;
      }) => isActive ? (
        <div className="loa-list__row-actions">
          <Tooltip arrow placement="top" title="Delete">
            <IconButton
              classes={{
                root: "loa-list__delete-btn",
              }}
              onClick={() => {
                console.log(`Delete LOA ${row.getValue("loaNumber")}`); //
              }}
              disabled={false}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </IconButton>
          </Tooltip>
        </div>
      ) : null,
      [isActive],
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
