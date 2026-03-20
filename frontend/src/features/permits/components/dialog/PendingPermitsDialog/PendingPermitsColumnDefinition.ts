import { MRT_ColumnDef } from "material-react-table";

import { ApplicationListItem } from "../../../types/application";

export const PendingPermitsColumnDefinition: MRT_ColumnDef<ApplicationListItem>[] = [
  {
    accessorKey: "applicationNumber",
    id: "applicationNumber",
    enableSorting: false,
    header: "Application #",
    size: 250,
  },
  {
    accessorKey: "plate",
    id: "plate",
    enableSorting: false,
    header: "Plate",
    size: 100,
  },
  {
    accessorKey: "applicant",
    id: "applicant",
    header: "Applicant",
    enableSorting: false,
    size: 250,
  },
];
