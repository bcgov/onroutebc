import {
  IdentifiedObject,
  SizeDimension,
  PowerUnitWeightDimension,
  TrailerWeightDimension,
} from 'onroute-policy-engine/types';

export type VehicleCategory = IdentifiedObject & {
  defaultSizeDimensions?: SizeDimension;
};

export type PowerUnitCategory = VehicleCategory & {
  defaultWeightDimensions?: Array<PowerUnitWeightDimension>;
};

export type TrailerCategory = VehicleCategory & {
  defaultWeightDimensions?: Array<TrailerWeightDimension>;
};

export type VehicleCategories = {
  powerUnitCategories: Array<PowerUnitCategory>;
  trailerCategories: Array<TrailerCategory>;
};
