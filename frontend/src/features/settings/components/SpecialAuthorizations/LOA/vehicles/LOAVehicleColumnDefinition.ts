import { MRT_ColumnDef } from "material-react-table";

import { LOAVehicle } from "../../../../types/LOAVehicle";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";

export const LOAVehicleColumnDefinition: MRT_ColumnDef<LOAVehicle>[] = [
  {
    accessorKey: "unitNumber",
    header: "Unit #",
    size: 150,
  },
  {
    accessorKey: "make",
    header: "Make",
    size: 150,
  },
  {
    accessorKey: "vin",
    header: "VIN",
    size: 150,
  },
  {
    accessorKey: "plate",
    header: "Plate",
    size: 150,
  },
  {
    header: "Vehicle Sub-type",
    accessorFn: (originalRow) =>
      getDefaultRequiredVal(
        "",
        originalRow.vehicleSubType.type,
      ) as string,
    id: "vehicleSubType",
    size: 200,
  },
];
