import {
  SelfIssuable,
  SizeDimension,
  PowerUnitWeightDimension,
  TrailerWeightDimension,
} from 'onroute-policy-engine/types';

export type Vehicle = SelfIssuable & {
  type: string;
  canFollow: Array<string>;
  sizeDimensions?: Array<SizeDimension>;
};

export type PowerUnit = Vehicle & {
  weightDimensions?: Array<PowerUnitWeightDimension>;
};

export type Trailer = Vehicle & {
  weightDimensions?: Array<TrailerWeightDimension>;
};
