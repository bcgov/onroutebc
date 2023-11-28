import { MRT_ColumnDef } from "material-react-table";
import { VehicleTypes } from "../../types/managevehicles";
import { DATE_FORMATS, toLocal } from "../../../../common/helpers/formatDate";
import { applyWhenNotNullable } from "../../../../common/helpers/util";

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
    accessorKey: "createdDateTime",
    header: "Date Created",
    Cell: (props: { cell: any; row: any }) => {
      const originalDate = props.cell.getValue()
      const formattedDate = applyWhenNotNullable(
        (dt) => toLocal(dt, DATE_FORMATS.DATEONLY_ABBR_MONTH),
        originalDate,
        "NA",
      );
      return (
        <div>
          {formattedDate}
        </div>
      );
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
    accessorKey: "createdDateTime",
    header: "Date Created",
  },
];
