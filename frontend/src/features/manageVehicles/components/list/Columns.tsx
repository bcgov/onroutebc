import { MRT_ColumnDef } from "material-react-table";
import { Vehicle } from "../../types/Vehicle";
import { formatCellValuetoDatetime } from "../../../../common/helpers/tableHelper";

const CommonVehicleColumnDefinition: MRT_ColumnDef<Vehicle>[] = [
  {
    accessorKey: "unitNumber",
    header: "Unit #",
    size: 50,
  },
  {
    accessorKey: "make",
    header: "Make",
    size: 100,
  },
  {
    accessorKey: "vin",
    header: "VIN",
    size: 50,
  },
  {
    accessorKey: "plate",
    header: "Plate",
    size: 50,
  },
];

const CreatedAtColumnDefinition: MRT_ColumnDef<Vehicle> = {
  accessorKey: "createdDateTime",
  header: "Date Created",
  Cell: (props: { cell: any }) => {
    const formattedDate = formatCellValuetoDatetime(props.cell.getValue());
    return <span>{formattedDate}</span>;
  },
  size: 100,
};

/**
 * The Columns Options are from Material React Table.
 * For a list of options, see here:
 * https://www.material-react-table.com/docs/api/column-options
 */
export const PowerUnitColumnDefinition: MRT_ColumnDef<Vehicle>[] = [
  {
    accessorKey: "powerUnitId",
    header: "Power unit Id",
  },
  ...CommonVehicleColumnDefinition,
  {
    accessorKey: "vehicleSubType",
    header: "Vehicle Sub-Type",
    size: 200,
  },
  CreatedAtColumnDefinition,
];

export const TrailerColumnDefinition: MRT_ColumnDef<Vehicle>[] = [
  {
    accessorKey: "trailerId",
    header: "Trailer Id",
  },
  ...CommonVehicleColumnDefinition,
  {
    accessorKey: "vehicleSubType",
    header: "Vehicle Sub-Type",
    size: 200,
  },
  CreatedAtColumnDefinition,
];
