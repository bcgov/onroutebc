import { useEffect, useState } from "react";
import { Policy, ValidationResult } from "onroute-policy-engine";

import { Nullable } from "../../../common/types/common";
import { PermitType } from "../types/PermitType";
import { ReplaceDayjsWithString } from "../types/utility";
import { PermitData } from "../types/PermitData";

export const usePolicyWarnings = (
  permit: {
    permitType: PermitType;
    permitData: Partial<ReplaceDayjsWithString<PermitData>>;
  },
  policyEngine?: Nullable<Policy>,
) => {
  const [policyWarnings, setPolicyWarnings] = useState<ValidationResult[]>([]);

  useEffect(() => {
    const validate = async () => {
      if (policyEngine) {
        const { warnings } = await policyEngine.validate(permit);
      
        setPolicyWarnings(warnings);
      }
    };

    validate();
  }, [permit, policyEngine]);

  return { policyWarnings };
};
