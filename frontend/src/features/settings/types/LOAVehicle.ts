import { Nullable } from "../../../common/types/common";
import { VehicleType } from "../../manageVehicles/types/Vehicle";

export interface LOAVehicle {
  vehicleId: string;
  unitNumber?: Nullable<string>;
  make: string;
  vin: string;
  plate: string;
  vehicleType: VehicleType;
  vehicleSubType: {
    typeCode: string;
    type?: Nullable<string>;
  };
};
