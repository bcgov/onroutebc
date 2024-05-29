import { MRT_ColumnDef } from "material-react-table";

import { LOAVehicle } from "../../../../types/LOAVehicle";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";

export const LOAVehicleColumnDefinition: MRT_ColumnDef<LOAVehicle>[] = [
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
  },
  {
    header: "Vehicle Sub-type",
    accessorFn: (originalRow) =>
      getDefaultRequiredVal(
        "",
        originalRow.vehicleSubType.type,
      ) as string,
    id: "vehicleSubType",
  },
];
