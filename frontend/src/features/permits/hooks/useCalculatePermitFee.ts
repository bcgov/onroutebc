import { useEffect, useState } from "react";
import { Policy, ValidationResult } from "onroute-policy-engine";

import { PermitType } from "../types/PermitType";
import { ReplaceDayjsWithString } from "../types/utility";
import { PermitData } from "../types/PermitData";
import { Nullable } from "../../../common/types/common";
import { calculatePermitFee } from "../helpers/feeSummary";
import { areOrderedSequencesEqual } from "../../../common/helpers/equality";
import { getDefaultRequiredVal } from "../../../common/helpers/util";

/**
 * Hook that calculates the total cost and intermediary costs for a permit.
 * (The policy engine calculates the fee in an async manner, hence this hook acts as a utility hook
 * to get the fee in a synchronous manner.)
 * 
 * @param permit Object containing permit information (must have permitType and parts of permitData)
 * @param policyEngine Instance of policy engine, if it exists
 * @returns Total cost to be paid for the permit, as well as intermediary costs
 */
export const useCalculatePermitFee = (
  permit: {
    permitType: PermitType;
    permitData: Partial<ReplaceDayjsWithString<PermitData>>;
  },
  policyEngine?: Nullable<Policy>,
) => {
  const [totalCost, setTotalCost] = useState<number>(0);
  const [costs, setCosts] = useState<ValidationResult[]>([]);

  useEffect(() => {
    const updateCosts = async () => {
      const {
        totalCost: updatedTotalCost,
        costs: updatedCosts,
      } = await calculatePermitFee(permit, policyEngine);
      
      setTotalCost(updatedTotalCost);

      // IMPORTANT: Since 'costs' is an array of ValidationResult objects that will be returned and used
      // in other components, it's important to memoize it to avoid potential infinite render loops.
      // Cost objects are assumed to be ordered, and they're considered to be the same if they have
      // the same type ('cost'), code, message (cost description), and cost value
      if (!areOrderedSequencesEqual(
        costs,
        updatedCosts,
        (costItem1, costItem2) =>
          costItem1.code === costItem2.code
          && costItem1.type === costItem2.type
          && costItem1.message === costItem2.message
          && getDefaultRequiredVal(0, costItem1.cost) === getDefaultRequiredVal(0, costItem2.cost)
      )) {
        setCosts(updatedCosts);
      }
    };

    updateCosts();
  }, [permit, policyEngine]);

  return {
    totalCost,
    costs,
  };
};
