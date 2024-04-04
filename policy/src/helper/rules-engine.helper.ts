import { Engine } from "json-rules-engine";
import CustomOperators from "../rule-operator/custom-operators";
import Policy from "../policy-engine";
import PolicyDefinition from "../interface/policy-definition.interface";


function getEngine(policyDefinition: PolicyDefinition): Engine {
  let engine = new Engine();
  CustomOperators.forEach((o) => engine.addOperator(o))
  policyDefinition.commonRules.forEach((r) => engine.addRule(r))
  return engine;
}

export function getRulesEngines(policy: Policy): Map<string, Engine> {
  const engineMap: Map<string, Engine> = new Map<string, Engine>()

  policy.policyDefinition.permitTypes.forEach((permitType) => {
    const engine = getEngine(policy.policyDefinition)

    permitType.rules.forEach((r) => engine.addRule(r))

    engineMap.set(permitType.id, engine)
  })
  
  return engineMap
}