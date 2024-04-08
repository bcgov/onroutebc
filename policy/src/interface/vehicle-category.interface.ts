import IdentifiedObject from './identified-object.interface';
import { SizeDimension } from './size-dimension.interface';
import {
  PowerUnitWeightDimension,
  TrailerWeightDimension,
} from './weight-dimension.interface';

interface VehicleCategory extends IdentifiedObject {
  defaultSizeDimensions?: SizeDimension;
}

interface PowerUnitCategory extends VehicleCategory {
  defaultWeightDimensions?: Array<PowerUnitWeightDimension>;
}

interface TrailerCategory extends VehicleCategory {
  defaultWeightDimensions?: Array<TrailerWeightDimension>;
}

export { VehicleCategory, PowerUnitCategory, TrailerCategory };
