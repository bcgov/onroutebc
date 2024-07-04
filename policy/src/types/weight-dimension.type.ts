import { DimensionModifier, SelfIssuable } from 'onroute-policy-engine/types';

export type WeightDimension = SelfIssuable & {
  axles: number;
  modifiers?: Array<DimensionModifier>;
};

export type PowerUnitWeightDimension = WeightDimension & {
  saLegal?: number;
  saPermittable?: number;
  daLegal?: number;
  daPermittable?: number;
};

export type TrailerWeightDimension = WeightDimension & {
  legal?: number;
  permittable?: number;
};

export type DefaultWeightDimensions = {
  powerUnits: Array<PowerUnitWeightDimension>;
  trailers: Array<TrailerWeightDimension>;
};
