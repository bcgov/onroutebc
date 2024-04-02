import IdentifiedObject from './interface/identified-object.interface';
import PolicyDefinition from './interface/policy-definition.interface';
import { extractIdentifiedObjects } from './helper/lists.helper';
import PermitType from './interface/permit-type.interface';
import { PowerUnitType, TrailerType } from './interface/vehicle-type.interface';
import { PowerUnitCategory } from './interface/vehicle-category.interface';

class Policy { 
  policyDefinition: PolicyDefinition;

  constructor(definition: PolicyDefinition) {
    this.policyDefinition = definition;
  }

  getPermitTypes(): Array<IdentifiedObject> {
    let permitTypes = extractIdentifiedObjects(this.policyDefinition.permitTypes);
    return permitTypes;
  }

  getGeographicRegions(): Array<IdentifiedObject> {
    let geographicRegions = extractIdentifiedObjects(this.policyDefinition.geographicRegions);
    return geographicRegions;
  }

  getCommodities(): Array<IdentifiedObject> {
    let commodities = extractIdentifiedObjects(this.policyDefinition.commodities);
    return commodities;
  }

  getPowerUnitTypes(): Array<IdentifiedObject> {
    let powerUnitTypes = extractIdentifiedObjects(this.policyDefinition.vehicleTypes.powerUnitTypes);
    return powerUnitTypes;
  }

  getTrailerTypes(): Array<IdentifiedObject> {
    let trailerTypes = extractIdentifiedObjects(this.policyDefinition.vehicleTypes.trailerTypes);
    return trailerTypes;
  }

  getPermitTypeDefinition(type: string): PermitType | null {
    let permitType: PermitType | undefined;
    if (this.policyDefinition.permitTypes) {
      permitType = this.policyDefinition.permitTypes.find((p) => p.id === type);
    }

    if (permitType) {
      return permitType;
    } else {
      return null;
    }
  }

  getPowerUnitTypeDefinition(type: string): PowerUnitType | null {
    let powerUnitType: PowerUnitType | undefined;
    if (this.policyDefinition.vehicleTypes.powerUnitTypes) {
      powerUnitType = this.policyDefinition.vehicleTypes.powerUnitTypes.find((p) => p.id === type);

      if (powerUnitType) {
        let powerUnitTypeClone: PowerUnitType;
        powerUnitTypeClone = JSON.parse(JSON.stringify(powerUnitType));

        // Fill in dimensions with default values if necessary
        let category: PowerUnitCategory | undefined;
        category = this.policyDefinition.vehicleCategories?.powerUnitCategories?.find((c) => c.id === powerUnitTypeClone.id);

        if (!(powerUnitTypeClone.defaultWeightDimensions)) {
          // Look for a category weight default
          if (category?.defaultWeightDimensions) {
            powerUnitTypeClone.defaultWeightDimensions = category.defaultWeightDimensions;
          } else {
            // Retrieve global weight default
            powerUnitTypeClone.defaultWeightDimensions = this.policyDefinition.globalWeightDefaults.powerUnits;
          }
        }

        if (!(powerUnitTypeClone.defaultSizeDimensions)) {
          // Look for a category size default
          if (category?.defaultSizeDimensions) {
            powerUnitTypeClone.defaultSizeDimensions = category.defaultSizeDimensions;
          } else {
            // Retrieve global size default
            powerUnitTypeClone.defaultSizeDimensions = this.policyDefinition.globalSizeDefaults;
          }
        }
        return powerUnitTypeClone;
      }
    }
    return null;
  }

  getTrailerTypeDefinition(type: string): TrailerType | null {
    let trailerType: TrailerType | undefined;
    if (this.policyDefinition.vehicleTypes.trailerTypes) {
      trailerType = this.policyDefinition.vehicleTypes.trailerTypes.find((p) => p.id === type);

      if (trailerType) {
        let trailerTypeClone: TrailerType;
        trailerTypeClone = JSON.parse(JSON.stringify(trailerType));

        // Fill in dimensions with default values if necessary
        let category: PowerUnitCategory | undefined;
        category = this.policyDefinition.vehicleCategories?.trailerCategories?.find((c) => c.id === trailerTypeClone.id);

        if (!(trailerTypeClone.defaultWeightDimensions)) {
          // Look for a category weight default
          if (category?.defaultWeightDimensions) {
            trailerTypeClone.defaultWeightDimensions = category.defaultWeightDimensions;
          } else {
            // Retrieve global weight default
            trailerTypeClone.defaultWeightDimensions = this.policyDefinition.globalWeightDefaults.powerUnits;
          }
        }

        if (!(trailerTypeClone.defaultSizeDimensions)) {
          // Look for a category size default
          if (category?.defaultSizeDimensions) {
            trailerTypeClone.defaultSizeDimensions = category.defaultSizeDimensions;
          } else {
            // Retrieve global size default
            trailerTypeClone.defaultSizeDimensions = this.policyDefinition.globalSizeDefaults;
          }
        }
        return trailerTypeClone;
      }
    }
    return null;
  }

}

export default Policy;