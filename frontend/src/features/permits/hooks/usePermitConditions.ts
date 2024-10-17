import { useEffect } from "react";

import { areArraysEqual } from "../../../common/helpers/util";
import { PermitCondition } from "../types/PermitCondition";
import { getUpdatedConditionsForLCV } from "../helpers/permitLCV";

export const usePermitConditions = (
  selectedConditions: PermitCondition[],
  isLcvDesignated: boolean,
  vehicleSubtype: string,
  onSetConditions: (conditions: PermitCondition[]) => void,
) => {
  // If conditions were changed as a result of LCV or vehicle subtype, update permit conditions
  const updatedConditions = getUpdatedConditionsForLCV(
    isLcvDesignated,
    selectedConditions,
    vehicleSubtype,
  );

  useEffect(() => {
    if (!areArraysEqual(
      updatedConditions.map(({ condition }) => condition),
      selectedConditions.map(({ condition }: PermitCondition) => condition),
    )) {
      onSetConditions(updatedConditions);
    }
  }, [
    updatedConditions,
    selectedConditions,
    onSetConditions,
  ]);

  return { updatedConditions };
};
