import { MRT_ColumnDef } from "material-react-table";
import { IPowerUnit } from "../../@types/managevehicles";

const plateOptions = ["AAA"];

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
    filterVariant: 'multi-select',
    filterSelectOptions: plateOptions,
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
