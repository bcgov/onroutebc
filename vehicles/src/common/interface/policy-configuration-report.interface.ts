import type { PolicyDefinition } from 'onroute-policy-engine/types';

export interface PolicyConfiguration {
  policyConfigId: number;
  policy: PolicyDefinition;
  effectiveDate: string;
  isDraft: boolean;
  changeDescription: string;
}
