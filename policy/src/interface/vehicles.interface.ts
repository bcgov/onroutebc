import { SizeDimension } from './size-dimension.interface';
import {
  PowerUnitWeightDimension,
  TrailerWeightDimension,
} from './weight-dimension.interface';

interface Vehicle {
  type: string;
  canFollow: Array<string>;
  sizeDimensions?: Array<SizeDimension>;
}

interface PowerUnit extends Vehicle {
  weightDimensions?: Array<PowerUnitWeightDimension>;
}

interface Trailer extends Vehicle {
  weightDimensions?: Array<TrailerWeightDimension>;
}

export { Vehicle, PowerUnit, Trailer };
