import PolicyDefinition from './interface/policy-definition.interface';
import { extractIdentifiedObjects } from './helper/lists.helper';
import PermitType from './interface/permit-type.interface';
import { Engine, EngineResult } from 'json-rules-engine';
import { getRulesEngines } from './helper/rules-engine.helper';
import PermitApplication from './type/permit-application.type';
import ValidationResult from './validation-result';
import { addRuntimeFacts } from './helper/facts.helper';

class Policy {
  policyDefinition: PolicyDefinition;
  rulesEngines: Map<string, Engine>;

  constructor(definition: PolicyDefinition) {
    this.policyDefinition = definition;

    this.rulesEngines = getRulesEngines(this);
  }

  async validate(permit: PermitApplication): Promise<ValidationResult> {
    const engine = this.rulesEngines.get(permit.permitType);
    if (!engine) {
      const validationResult: ValidationResult = new ValidationResult();
      validationResult.violations.push(
        `Permit type ${permit.permitType} not permittable`,
      );
      return validationResult;
    } else {
      addRuntimeFacts(engine);
      const engineResult: EngineResult = await engine.run(permit);
      return new ValidationResult(engineResult);
    }
  }

  getPermitTypes(): Map<string, string> {
    const permitTypes = extractIdentifiedObjects(
      this.policyDefinition.permitTypes,
    );
    return permitTypes;
  }

  getGeographicRegions(): Map<string, string> {
    const geographicRegions = extractIdentifiedObjects(
      this.policyDefinition.geographicRegions,
    );
    return geographicRegions;
  }

  getCommodities(): Map<string, string> {
    const commodities = extractIdentifiedObjects(
      this.policyDefinition.commodities,
    );
    return commodities;
  }

  getPowerUnitTypes(): Map<string, string> {
    const powerUnitTypes = extractIdentifiedObjects(
      this.policyDefinition.vehicleTypes.powerUnitTypes,
    );
    return powerUnitTypes;
  }

  getTrailerTypes(): Map<string, string> {
    const trailerTypes = extractIdentifiedObjects(
      this.policyDefinition.vehicleTypes.trailerTypes,
    );
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
}

export default Policy;
