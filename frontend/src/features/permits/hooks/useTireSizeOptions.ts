import { useMemo } from "react";
import { Policy } from "onroute-policy-engine";

import { Nullable } from "../../../common/types/common";

export const useTireSizeOptions = (policyEngine: Nullable<Policy>) => {
  const tireSizeOptions = useMemo(() => {
    return policyEngine?.getStandardTireSizes();
  }, [policyEngine]);

  return {
    tireSizeOptions,
  };
};
