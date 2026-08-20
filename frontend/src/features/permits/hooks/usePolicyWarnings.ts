import { useEffect, useState } from "react";
import { Policy, ValidationResult } from "onroute-policy-engine";

import { Nullable } from "../../../common/types/common";
import { PermitType } from "../types/PermitType";
import { ReplaceDayjsWithString } from "../types/utility";
import { PermitData } from "../types/PermitData";
import { doUniqueArraysHaveSameObjects } from "../../../common/helpers/equality";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { hasPolicyValidationIssues } from "../helpers/policy/hasPolicyValidationIssues";

export const usePolicyWarnings = (
  permit: {
    permitType: PermitType;
    permitData: Partial<ReplaceDayjsWithString<PermitData>>;
  },
  policyEngine?: Nullable<Policy>,
) => {
  const [policyWarnings, setPolicyWarnings] = useState<ValidationResult[]>([]);
  const [hasPolicyIssues, setHasPolicyIssues] = useState(false);

  useEffect(() => {
    const validate = async () => {
      if (policyEngine) {
        const validationResults = await policyEngine.validate(permit);
        const { warnings } = validationResults;

        setHasPolicyIssues(hasPolicyValidationIssues(validationResults));

        // IMPORTANT: Since 'warnings' is an array of ValidationResult objects that will be returned and used
        // in other components, it's important to memoize it to avoid potential infinite render loops.
        // Warning arrays are assumed to contain unique objects (since there shouldn't be cases where
        // the same warning appears multiple times), and warning objects are considered to be the same
        // if they have the same type ('warning'), code, field reference, and message
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

  return { policyWarnings, hasPolicyIssues };
};
