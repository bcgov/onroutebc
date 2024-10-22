import { Policy } from "onroute-policy-engine";
import { PolicyDefinition } from "onroute-policy-engine/dist/types/policy-definition";

export const getPolicyEngine = (policyDefinition: PolicyDefinition) =>
  new Policy(policyDefinition);
