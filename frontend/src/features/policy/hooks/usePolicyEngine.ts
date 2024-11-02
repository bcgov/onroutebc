import { useMemo } from "react";
import { Policy } from "onroute-policy-engine";

import { usePolicyConfigurationQuery } from "./usePolicyConfigurationQuery";

/**
 * Hook that instantiates the policy engine instance.
 * @returns Policy engine instance, or null if policy configuration isn't available
 */
export const usePolicyEngine = () => {
  const { data: policyConfiguration } = usePolicyConfigurationQuery();

  const policyEngine = useMemo(() => {
    if (!policyConfiguration) return null;

    return new Policy(policyConfiguration.policy);
  }, [policyConfiguration]);

  return policyEngine;
};
