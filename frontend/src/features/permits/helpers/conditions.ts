import { LCV_CONDITION } from "../constants/constants";
import { MANDATORY_TROS_CONDITIONS, TROS_CONDITIONS } from "../constants/tros";
import { MANDATORY_TROW_CONDITIONS, TROW_CONDITIONS } from "../constants/trow";
import { PermitCondition } from "../types/PermitCondition";
import { PERMIT_TYPES, PermitType } from "../types/PermitType";

/**
 * Get mandatory conditions that must be selected for a permit type.
 * @param permitType Permit type to get the conditions for
 * @param includeLcvCondition Whether or not to include LCV condition
 * @returns Mandatory conditions that will be automatically selected
 */
export const getMandatoryConditions = (
  permitType: PermitType,
  includeLcvCondition?: boolean,
) => {
  const additionalConditions = includeLcvCondition ? [LCV_CONDITION] : [];
  switch (permitType) {
    case PERMIT_TYPES.TROW:
      return MANDATORY_TROW_CONDITIONS.concat(additionalConditions);
    case PERMIT_TYPES.TROS:
      return MANDATORY_TROS_CONDITIONS.concat(additionalConditions);
    default:
      return additionalConditions;
  }
};

const getConditionsByPermitType = (
  permitType: PermitType,
  includeLcvCondition?: boolean,
) => {
  const additionalConditions = includeLcvCondition ? [LCV_CONDITION] : [];
  switch (permitType) {
    case PERMIT_TYPES.TROW:
      return TROW_CONDITIONS.concat(additionalConditions);
    case PERMIT_TYPES.TROS:
      return TROS_CONDITIONS.concat(additionalConditions);
    default:
      return additionalConditions;
  }
};

const isConditionMandatory = (
  condition: PermitCondition,
  mandatoryConditions: PermitCondition[],
) => {
  return mandatoryConditions
    .map(mandatoryCondition => mandatoryCondition.condition)
    .includes(condition.condition);
};

/**
 * Get sorted list of permit conditions, ordered from mandatory (disabled) to selectable ones.
 * @param conditions List of possibly unsorted permit conditions
 * @returns Sorted list of permit conditions, from mandatory to selectable ones
 */
export const sortConditions = (conditions: PermitCondition[]) => {
  return [...conditions].sort((condition1, condition2) => {
    if (condition1.disabled && condition2.disabled) return 0;
    if (!condition1.disabled && !condition2.disabled) return 0;
    return condition1.disabled && !condition2.disabled ? -1 : 1;
  });
};

/**
 * Get default conditions (in their initial states) for a permit/application form.
 * @param permitType Permit type to get the conditions for
 * @param includeLcvCondition Whether or not to include LCV condition
 * @returns Default conditions for a given permit type
 */
export const getDefaultConditions = (
  permitType: PermitType,
  includeLcvCondition?: boolean,
) => {
  const mandatoryConditions = getMandatoryConditions(permitType, includeLcvCondition);

  return sortConditions(
    getConditionsByPermitType(permitType, includeLcvCondition).map((condition) => ({
      ...condition,
      // must-select options are checked and disabled (for toggling) by default
      checked: isConditionMandatory(condition, mandatoryConditions),
      disabled: isConditionMandatory(condition, mandatoryConditions),
    })),
  );
};
