import { Nullable } from "../../../common/types/common";
import { VehicleType } from "../../manageVehicles/types/Vehicle";
import { PermitType } from "../../permits/types/PermitType";

export interface LOADetail {
  loaId: number;
  loaNumber: number;
  companyId: number;
  startDate: string;
  expiryDate?: Nullable<string>;
  documentId: string;
  fileName: string;
  loaPermitType: PermitType[];
  comment?: Nullable<string>;
  vehicleType: VehicleType;
  vehicleSubType: string;
  originalLoaId: number;
  previousLoaId?: Nullable<number>;
}
