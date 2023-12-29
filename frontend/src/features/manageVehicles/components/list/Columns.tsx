import { MRT_ColumnDef } from "material-react-table";
import { VehicleTypes } from "../../types/managevehicles";
import { formatCellValuetoDatetime } from "../../../../common/helpers/tableHelper";

const CommonVehicleColumnDefinition: MRT_ColumnDef<VehicleTypes>[] = [
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
];

const CreatedAtColumnDefinition: MRT_ColumnDef<VehicleTypes> = {
  accessorKey: "createdDateTime",
  header: "Date Created",
  Cell: (props: { cell: any }) => {
    const formattedDate = formatCellValuetoDatetime(props.cell.getValue());
    return <span>{formattedDate}</span>;
  },
};

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
  ...CommonVehicleColumnDefinition,
  {
    accessorKey: "powerUnitTypeCode",
    header: "Vehicle Sub-Type",
  },
  CreatedAtColumnDefinition,
];

export const TrailerColumnDefinition: MRT_ColumnDef<VehicleTypes>[] = [
  {
    accessorKey: "trailerId",
    header: "Trailer Id",
  },
  ...CommonVehicleColumnDefinition,
  {
    accessorKey: "trailerTypeCode",
    header: "Vehicle Sub-Type",
  },
  CreatedAtColumnDefinition,
];
