import { MRT_ColumnDef } from "material-react-table";

import { VehicleTypes } from "../../types/managevehicles";
import { applyWhenNotNullable } from "../../../../common/helpers/util";
import { DATE_FORMATS, toLocal } from "../../../../common/helpers/formatDate";

/**
 * The Columns Options are from Material React Table.
 * For a list of options, see here:
 * https://www.material-react-table.com/docs/api/column-options
 */
export const PowerUnitColumnDefinition: MRT_ColumnDef<VehicleTypes>[] = [
  {
    accessorKey: "powerUnitId",
    header: "Power unit Id",
  },
  {
    accessorKey: "unitNumber",
    header: "Unit #",
  },
  {
    accessorKey: "make",
    header: "Make",
  },
  {
    accessorKey: "vin",
    header: "VIN",
  },
  {
    accessorKey: "plate",
    header: "Plate",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "powerUnitTypeCode",
    header: "Vehicle Sub-Type",
  },
  {
    id: "createdDateTime",
    header: "Date Created",
    accessorFn: (originalRow) => {
      const { createdDateTime } = originalRow;
      const createdDtLocal = applyWhenNotNullable(
        dt => toLocal(dt, DATE_FORMATS.LONG),
        createdDateTime,
        ""
      );
      return createdDtLocal;
    },
  },
];

export const TrailerColumnDefinition: MRT_ColumnDef<VehicleTypes>[] = [
  {
    accessorKey: "trailerId",
    header: "Trailer Id",
  },
  {
    accessorKey: "unitNumber",
    header: "Unit #",
  },
  {
    accessorKey: "make",
    header: "Make",
  },
  {
    accessorKey: "vin",
    header: "VIN",
  },
  {
    accessorKey: "plate",
    header: "Plate",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "trailerTypeCode",
    header: "Vehicle Sub-Type",
  },
  {
    id: "createdDateTime",
    header: "Date Created",
    accessorFn: (originalRow) => {
      const { createdDateTime } = originalRow;
      const createdDtLocal = applyWhenNotNullable(
        dt => toLocal(dt, DATE_FORMATS.LONG),
        createdDateTime,
        ""
      );
      return createdDtLocal;
    },
  },
];
