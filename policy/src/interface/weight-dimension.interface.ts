import DimensionModifier from "./dimension-modifier.interface";

interface WeightDimension {
  axles: number;
  modifiers?: Array<DimensionModifier>
}

interface PowerUnitWeightDimension extends WeightDimension {
  saLegal?: number;
  saPermittable?: number;
  daLegal?: number;
  daPermittable?: number;
}

interface TrailerWeightDimension extends WeightDimension {
  legal?: number;
  permittable?: number;
}

export {
  WeightDimension,
  PowerUnitWeightDimension,
  TrailerWeightDimension
}