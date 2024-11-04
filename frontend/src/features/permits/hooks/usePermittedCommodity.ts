import { useMemo } from "react";
import { Policy } from "onroute-policy-engine";

import { getPermittedCommodityOptions } from "../helpers/permittedCommodity";
import { PermitType } from "../types/PermitType";

export const usePermittedCommodity = (
  policyEngine: Policy,
  permitType: PermitType,
) => {
  const commodityOptions = useMemo(() => {
    return getPermittedCommodityOptions(permitType, policyEngine);
  }, [policyEngine, permitType]);

  return {
    commodityOptions,
  };
};
