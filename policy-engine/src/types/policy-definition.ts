import {
  GeographicRegion,
  PermitType,
  DefaultWeightDimensions,
  VehicleTypes,
  Commodity,
  SizeDimension,
  VehicleCategories,
  RangeMatrix,
} from 'onroute-policy-engine/types';
import { RuleProperties } from 'json-rules-engine';

export type PolicyDefinition = {
  version: string;
  geographicRegions: Array<GeographicRegion>;
  permitTypes: Array<PermitType>;
  commonRules: Array<RuleProperties>;
  globalWeightDefaults: DefaultWeightDimensions;
  globalSizeDefaults: SizeDimension;
  vehicleCategories: VehicleCategories;
  vehicleTypes: VehicleTypes;
  commodities: Array<Commodity>;
  rangeMatrices?: Array<RangeMatrix>;
};
