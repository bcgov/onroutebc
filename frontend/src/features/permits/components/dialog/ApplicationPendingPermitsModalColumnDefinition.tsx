import { MRT_ColumnDef } from "material-react-table";
import { ApplicationListItem } from "../../types/application";

export const ApplicationPendingPermitsModalColumnDefinition: MRT_ColumnDef<ApplicationListItem>[] =
[
  {
    accessorKey: "applicationNumber",
    id: "applicationNumber",
    enableSorting: false,
    header: "Application #",
  },
  {
    accessorKey: "plate",
    id: "plate",
    enableSorting: false,
    header: "Plate",
  },
  {
    accessorKey: "applicant",
    id: "applicant",
    header: "Applicant",
    enableSorting: false,
  },
];
