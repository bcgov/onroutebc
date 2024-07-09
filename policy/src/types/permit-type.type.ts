import { RuleProperties } from 'json-rules-engine';
import { IdentifiedObject } from 'onroute-policy-engine/types';

export type PermitType = IdentifiedObject & {
  routingRequired: boolean;
  weightDimensionRequired: boolean;
  sizeDimensionRequired: boolean;
  commodityRequired: boolean;
  allowedVehicles: Array<string>;
  allowedCommodities?: Array<string>;
  rules?: Array<RuleProperties>;
};
