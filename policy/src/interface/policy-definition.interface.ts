import GeographicRegion from './geographic-region.interface';
import PermitType from './permit-type.interface';
import { PowerUnitWeightDimension, TrailerWeightDimension } from './weight-dimension.interface';
import { PowerUnitType, TrailerType } from './vehicle-type.interface';
import Commodity from './commodity.interface';
import { SizeDimension } from './size-dimension.interface';
import { PowerUnitCategory, TrailerCategory } from './vehicle-category.interface';
import { RuleProperties } from 'json-rules-engine';

type DefaultWeightDimensions = {
  powerUnits: Array<PowerUnitWeightDimension>;
  trailers: Array<TrailerWeightDimension>;
};

type VehicleCategories = {
  powerUnitCategories: Array<PowerUnitCategory>;
  trailerCategories: Array<TrailerCategory>;
};

type VehicleTypes = {
  powerUnitTypes: Array<PowerUnitType>;
  trailerTypes: Array<TrailerType>;
};

interface PolicyDefinition {
  version: string;
  geographicRegions: Array<GeographicRegion>;
  permitTypes: Array<PermitType>;
  commonRules: Array<RuleProperties>;
  globalWeightDefaults: DefaultWeightDimensions;
  globalSizeDefaults: SizeDimension;
  vehicleCategories: VehicleCategories;
  vehicleTypes: VehicleTypes;
  commodities: Array<Commodity>;
}

export default PolicyDefinition;