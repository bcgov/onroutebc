import { useEffect, useMemo } from "react";

import { PermitCondition } from "../types/PermitCondition";
import { getUpdatedConditionsForLCV } from "../helpers/permitLCV";
import { doUniqueArraysHaveSameItems } from "../../../common/helpers/equality";
import { PermitType } from "../types/PermitType";
import { getDefaultConditions } from "../helpers/conditions";
import { isVehicleSubtypeLCV } from "../../manageVehicles/helpers/vehicleSubtypes";

export const usePermitConditions = (
  permitType: PermitType,
  selectedConditions: PermitCondition[],
  isLcvDesignated: boolean,
  vehicleSubtype: string,
  onSetConditions: (conditions: PermitCondition[]) => void,
) => {
  // All possible conditions to be used for conditions table, including non-selected ones
  const allConditions = useMemo(() => {
    const defaultConditionsForPermitType = getDefaultConditions(
      permitType,
      isLcvDesignated && isVehicleSubtypeLCV(vehicleSubtype),
    );

    const updatedConditionsInForm = getUpdatedConditionsForLCV(
      isLcvDesignated,
      selectedConditions,
      vehicleSubtype,
    );

    return defaultConditionsForPermitType.map((defaultCondition) => {
      // Select all conditions that were previously selected
      const existingCondition = updatedConditionsInForm.find(
        (c) => c.condition === defaultCondition.condition,
      );
  
      return {
        ...defaultCondition,
        checked: existingCondition
          ? existingCondition.checked
          : defaultCondition.checked,
      };
    });
  }, [
    permitType,
    isLcvDesignated,
    vehicleSubtype,
    selectedConditions,
  ]);

  const updatedConditions = allConditions
    .filter(({ checked }) => checked);

  useEffect(() => {
    if (!doUniqueArraysHaveSameItems(
      updatedConditions.map(({ condition }) => condition),
      selectedConditions.map(({ condition }) => condition),
    )) {
      onSetConditions(updatedConditions);
    }
  }, [
    updatedConditions,
    selectedConditions,
  ]);

  return { allConditions };
};
