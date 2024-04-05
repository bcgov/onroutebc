import { RuleProperties } from 'json-rules-engine';
import IdentifiedObject from './identified-object.interface';

interface PermitType extends IdentifiedObject {
  routingRequired: boolean;
  weightDimensionRequired: boolean;
  sizeDimensionRequired: boolean;
  commodityRequired: boolean;
  allowedVehicles: Array<string>;
  allowedCommodities?: Array<string>;
  rules?: Array<RuleProperties>;
}

export default PermitType;
