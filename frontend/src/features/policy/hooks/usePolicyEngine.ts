import { Policy } from "onroute-policy-engine";
import { useCallback, useMemo } from "react";

import { usePolicyConfigurationQuery } from "./usePolicyConfigurationQuery";
import { PermitType } from "../../permits/types/PermitType";
import { Application } from "../../permits/types/application";
import { getDefaultRequiredVal } from "../../../common/helpers/util";

export const usePolicyEngine = (permitType: PermitType) => {
  const { data: policyConfiguration } = usePolicyConfigurationQuery();

  const policyEngine = useMemo(() => {
    if (!policyConfiguration) return null;

    return new Policy(policyConfiguration.policy);
  }, [policyConfiguration]);

  const validate = useCallback(
    (application: Application) => policyEngine?.validate(application),
    [policyEngine],
  );

  const commodityOptions = useMemo(() => {
    const commodities = getDefaultRequiredVal(
      new Map<string, string>(),
      policyEngine?.getCommodities(permitType),
    );

    return [...commodities.entries()]
      .map(([commodityType, commodityDescription]) => ({
        value: commodityType,
        label: commodityDescription,
      }));
  }, [policyEngine, permitType]);

  return {
    validate,
    commodityOptions,
  };
};
