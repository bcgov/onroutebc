import { PolicyDefinition } from 'onroute-policy-engine/dist/types';

export interface PolicyConfiguration {
  policyConfigId: number;
  policy: PolicyDefinition;
  effectiveDate: string;
  isDraft: boolean;
  changeDescription: string;
}
