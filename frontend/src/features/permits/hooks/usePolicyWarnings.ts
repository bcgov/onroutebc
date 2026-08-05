import { useEffect, useState } from "react";
import { Policy, ValidationResult } from "onroute-policy-engine";

import { Nullable } from "../../../common/types/common";
import { PermitType } from "../types/PermitType";
import { ReplaceDayjsWithString } from "../types/utility";
import { PermitData } from "../types/PermitData";
import { doUniqueArraysHaveSameObjects } from "../../../common/helpers/equality";
import { getDefaultRequiredVal } from "../../../common/helpers/util";

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
        
        if (!doUniqueArraysHaveSameObjects(
          policyWarnings,
          warnings,
          (validationResult) =>
            `${validationResult.type}_`
            + `${validationResult.code}_`
            + getDefaultRequiredVal("", validationResult.fieldReference)
            + `_${validationResult.message}`,
          (validationResult1, validationResult2) =>
            validationResult1.type === validationResult2.type
            && validationResult1.code === validationResult2.code
            && (
              getDefaultRequiredVal("", validationResult1.fieldReference)
                === getDefaultRequiredVal("", validationResult2.fieldReference)
            )
            && validationResult1.message === validationResult2.message
        )) {
          setPolicyWarnings(warnings);
        }
      }
    };

    validate();
  }, [permit, policyEngine]);

  return { policyWarnings };
};
