import { MRT_ColumnDef } from "material-react-table";
import { VehicleTypes } from "../../types/managevehicles";

/*
 *
 * The Columns Options are from Material React Table.
 * For a list of options, see here:
 * https://www.material-react-table.com/docs/api/column-options
 *
 *
 */

export const PowerUnitColumnDefinition: MRT_ColumnDef<VehicleTypes>[] = [
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
    header: "Vehicle Type",
  },
  {
    accessorKey: "createdDateTime",
    header: "Date Created",
  },
];

export const TrailerColumnDefinition: MRT_ColumnDef<VehicleTypes>[] = [
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
    header: "Vehicle Type",
  },
  {
    accessorKey: "createdDateTime",
    header: "Date Created",
  },
];
