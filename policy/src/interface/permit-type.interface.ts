import IdentifiedObject from './identified-object.interface';
import PermitDataValidation from './permit-data-validation.interface';

interface PermitType extends IdentifiedObject {
  routingRequired: boolean;
  weightDimentionRequired: boolean;
  sizeDimensionRequired: boolean;
  commodityRequired: boolean;
  allowedVehicles: Array<string>;
  allowedCommodities: Array<string>;
  dataValidations: Array<PermitDataValidation>;
}

export default PermitType;