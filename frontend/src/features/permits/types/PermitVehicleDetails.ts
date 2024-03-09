import { Nullable } from "../../../common/types/common";

export interface PermitVehicleDetails {
  vin: string;
  plate: string;
  make: string;
  year: Nullable<number>;
  countryCode: string;
  provinceCode: string;
  vehicleType: string;
  vehicleSubType: string;
  saveVehicle?: Nullable<boolean>;
  unitNumber?: Nullable<string>;
  vehicleId: Nullable<string>; // either powerUnitId or trailerId, depending on vehicleType
}
