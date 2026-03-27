import { Nullable } from "../../../common/types/common";
import { AxleUnit } from "../../bridgeFormulaCalculationTool/types/AxleUnit";

export interface VehicleInConfiguration {
  vehicleSubType: string;
  axleUnits?: Nullable<AxleUnit[]>;
}

export interface PermitVehicleConfiguration {
  overallLength?: Nullable<number>;
  overallWidth?: Nullable<number>;
  overallHeight?: Nullable<number>;
  frontProjection?: Nullable<number>;
  rearProjection?: Nullable<number>;
  trailers?: Nullable<VehicleInConfiguration[]>;
  loadedGVW?: Nullable<number>;
  netWeight?: Nullable<number>;
  axleUnits?: Nullable<AxleUnit[]>;
}
