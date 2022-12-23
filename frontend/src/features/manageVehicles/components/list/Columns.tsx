import { MRT_ColumnDef } from "material-react-table";
import { IPowerUnit } from "../../@types/managevehicles";

export const columnPowerUnitData : MRT_ColumnDef<IPowerUnit>[] = 
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
