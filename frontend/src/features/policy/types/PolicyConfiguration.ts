import { PolicyDefinition } from "onroute-policy-engine/dist/types/policy-definition";

export interface PolicyConfiguration {
  policyConfigId: number;
  effectiveDate: string;
  isDraft: boolean;
  changeDescription: string;
  policy: PolicyDefinition;
}
