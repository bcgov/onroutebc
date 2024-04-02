import DimensionModifier from "./dimension-modifier.interface";

interface RegionSizeOverride {
  region: string,
  width?: number,
  height?: number,
  length?: number
}

interface SizeDimension {
  frontProjection: number,
  rearProjection: number,
  width: number,
  height: number,
  length: number,
  modifiers?: Array<DimensionModifier>;
  regions?: Array<RegionSizeOverride>;
}

export {
  RegionSizeOverride,
  SizeDimension
}