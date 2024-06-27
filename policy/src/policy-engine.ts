import PolicyDefinition from './interface/policy-definition.interface';
import { extractIdentifiedObjects } from './helper/lists.helper';
import PermitType from './interface/permit-type.interface';
import { Engine, EngineResult } from 'json-rules-engine';
import { getRulesEngines } from './helper/rules-engine.helper';
import PermitApplication from './type/permit-application.type';
import ValidationResults from './validation-results';
import ValidationResult from './validation-result';
import { addRuntimeFacts, transformPermitFacts } from './helper/facts.helper';
import { ValidationResultType } from './enum/validation-result-type.enum';
import { ValidationResultCode } from './enum/validation-result-code.enum';

/** Class representing commercial vehicle policy. */
class Policy {
  /** Object representation of policy definition and rules. */
  policyDefinition: PolicyDefinition;

  /**
   * Map of json-rules-engine instances, one for each
   * permit type defined in the permit definition. Keyed
   * on permit type id.
   */
  rulesEngines: Map<string, Engine>;

  /**
   * Creates a new Policy object.
   * @param definition Policy definition to validate permits against
   */
  constructor(definition: PolicyDefinition) {
    this.policyDefinition = definition;

    this.rulesEngines = getRulesEngines(this);
  }

  /**
   * Validates a permit application against the policy definition.
   * @param permit The permit application to validate against policy
   * @returns Results of the validation of the permit application
   */
  async validate(permit: PermitApplication): Promise<ValidationResults> {
    const engine = this.rulesEngines.get(permit.permitType);
    if (!engine) {
      // If the permit type being validated has no configuration in the
      // policy definition, there will be no engine for it. Return with
      // a single violation result.
      const validationResult: ValidationResults = new ValidationResults();
      validationResult.violations.push(
        new ValidationResult(
          ValidationResultType.Violation,
          ValidationResultCode.PermitTypeUnknown,
          `Permit type ${permit.permitType} unknown`,
        )
      );
      return validationResult;
    } else {
      // Add facts specific to this run of the validation (e.g. validation
      // date for comparison against start date of the permit).
      addRuntimeFacts(engine);

      const permitFacts = transformPermitFacts(permit);

      // Run the json-rules-engine against the permit facts
      const engineResult: EngineResult = await engine.run(permitFacts);

      // Wrap the json-rules-engine result in a ValidationResult object
      return new ValidationResults(engineResult);
    }
  }

  /**
   * Gets a list of all configured permit types in the policy definition.
   * @returns Map of permit type IDs to permit type names.
   */
  getPermitTypes(): Map<string, string> {
    const permitTypes = extractIdentifiedObjects(
      this.policyDefinition.permitTypes,
    );
    return permitTypes;
  }

  /**
   * Gets a list of all configured geographic regions in the policy definition.
   * @returns Map of geographic region IDs to region names.
   */
  getGeographicRegions(): Map<string, string> {
    const geographicRegions = extractIdentifiedObjects(
      this.policyDefinition.geographicRegions,
    );
    return geographicRegions;
  }

  /**
   * Gets a list of all configured commodities in the policy definition.
   * @returns Map of commodity IDs to commodity names.
   */
  getCommodities(): Map<string, string> {
    const commodities = extractIdentifiedObjects(
      this.policyDefinition.commodities,
    );
    return commodities;
  }

  /**
   * Gets a list of all configured power unit types in the policy definition.
   * @returns Map of power unit type IDs to power unit type names.
   */
  getPowerUnitTypes(): Map<string, string> {
    const powerUnitTypes = extractIdentifiedObjects(
      this.policyDefinition.vehicleTypes.powerUnitTypes,
    );
    return powerUnitTypes;
  }

  /**
   * Gets a list of all configured trailer types in the policy definition.
   * @returns Map of trailer type IDs to trailer type names.
   */
  getTrailerTypes(): Map<string, string> {
    const trailerTypes = extractIdentifiedObjects(
      this.policyDefinition.vehicleTypes.trailerTypes,
    );
    return trailerTypes;
  }

  /**
   * Gets a full PermitType definition by ID.
   * @param type Type ID of the permit definition to return.
   * @returns PermitType definition for the supplied ID.
   */
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
