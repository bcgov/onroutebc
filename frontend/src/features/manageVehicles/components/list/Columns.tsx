import { MRT_ColumnDef } from "material-react-table";

import { VehicleTypes } from "../../types/managevehicles";
import { formatCellValuetoDatetime } from "../../../../common/constants/defaultTableOptions";

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
    Cell: (props: { cell: any }) => {
      const formattedDate = formatCellValuetoDatetime(props.cell.getValue());
      return <span>{formattedDate}</span>;
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
    Cell: (props: { cell: any }) => {
      const formattedDate = formatCellValuetoDatetime(props.cell.getValue());
      return <span>{formattedDate}</span>;
    },
  },
];
