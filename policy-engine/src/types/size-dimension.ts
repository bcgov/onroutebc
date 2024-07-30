import {
  DimensionModifier,
  RegionSizeOverride,
  SelfIssuable,
} from 'onroute-policy-engine/types';

export type SizeDimension = SelfIssuable & {
  frontProjection?: number;
  rearProjection?: number;
  width?: number;
  height?: number;
  length?: number;
  modifiers?: Array<DimensionModifier>;
  regions?: Array<RegionSizeOverride>;
};
