import {
  DimensionModifier,
  RegionSizeOverride,
} from 'onroute-policy-engine/types';

export type SizeDimension = {
  frontProjection: number;
  rearProjection: number;
  width: number;
  height: number;
  length: number;
  modifiers?: Array<DimensionModifier>;
  regions?: Array<RegionSizeOverride>;
};
