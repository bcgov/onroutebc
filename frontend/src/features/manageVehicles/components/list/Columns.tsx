import { MRT_ColumnDef } from "material-react-table";
import { IPowerUnit } from "../../types/managevehicles";

/*
 *
 * The Columns Options are from Material React Table.
 * For a list of options, see here:
 * https://www.material-react-table.com/docs/api/column-options
 * 
 * 
 */

export const PowerUnit_ColumnDef : MRT_ColumnDef<IPowerUnit>[] = 
[
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
    accessorKey: "plateNumber",
    header: "Plate",
    filterVariant: 'multi-select',
  },
  {
    accessorKey: "licensedGvw",
    header: "GVW",
  },
  {
    accessorKey: "createdDateTime",
    header: "Date Created",
  },
]
