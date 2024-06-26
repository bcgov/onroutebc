import { Engine } from 'json-rules-engine';
import CustomOperators from '../rule-operator/custom-operators';
import Policy from '../policy-engine';
import PolicyDefinition from '../interface/policy-definition.interface';
import { PolicyFacts } from '../enum/facts.enum';

/**
 * Gets a json-rules-engine with all onRouteBC custom operators added,
 * and all policy rules that apply to all permit types added.
 * @param policyDefinition The definition of policy to validate against.
 * @returns json-rules-engine Engine instance.
 */
function getEngine(policyDefinition: PolicyDefinition): Engine {
  const engine = new Engine();
  CustomOperators.forEach((o) => engine.addOperator(o));
  policyDefinition.commonRules.forEach((r) => engine.addRule(r));
  return engine;
}

/**
 * Creates a json-rules-engine Engine object for each permit type specified in
 * the policy definition, added to a Map. All rules specific to each permit type
 * will be added to the appropriate Engine instance.
 * @param policy orbc-policy-engine Policy object containg current policy definition.
 * @returns Map of json-rules-engines, one per permit type, keyed on permit type ID.
 */
export function getRulesEngines(policy: Policy): Map<string, Engine> {
  const engineMap: Map<string, Engine> = new Map<string, Engine>();

  policy.policyDefinition.permitTypes.forEach((permitType) => {
    const engine = getEngine(policy.policyDefinition);

    permitType.rules?.forEach((r) => engine.addRule(r));

    let allowedVehicles: Array<string>;
    if (permitType.allowedVehicles && permitType.allowedVehicles.length > 0) {
      allowedVehicles = permitType.allowedVehicles;
    } else {
      // If no allowed vehicles are specified, none are permitted
      allowedVehicles = [];
    }
    // Each permit type should have a list of allowed vehicles configured.
    engine.addFact(PolicyFacts.AllowedVehicles.toString(), allowedVehicles);

    engineMap.set(permitType.id, engine);
  });

  return engineMap;
}
