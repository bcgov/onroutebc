import IdentifiedObject from "./identified-object.interface";
import { SizeDimension } from "./size-dimension.interface";
import { PowerUnitWeightDimension, TrailerWeightDimension } from "./weight-dimension.interface";

interface VehicleType extends IdentifiedObject {
  category: string;
  defaultSizeDimensions?: SizeDimension;
}

interface PowerUnitType extends VehicleType {
  defaultWeightDimensions?: Array<PowerUnitWeightDimension>;
}

interface TrailerType extends VehicleType {
  defaultWeightDimensions?: Array<TrailerWeightDimension>;
}

export {
  VehicleType,
  PowerUnitType,
  TrailerType
}