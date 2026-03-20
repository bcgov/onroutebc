import { PermitActionType } from "../types/PermitActionType";
import { getPermitActionLabel } from "./getPermitActionLabel";

/**
 * Returns options for the row actions.
 * @param isExpired Has the permit expired?
 * @returns Action options that can be performed for the permit.
 */
export const getPermitActionOptions = (
  permitActions: {
    action: PermitActionType;
    isAuthorized: (isAuthorized: boolean) => boolean;
  }[],
  isExpired: boolean,
) => {
  return permitActions
    .filter((action) => action.isAuthorized(isExpired))
    .map(({ action }) => ({
      label: getPermitActionLabel(action),
      value: action,
    }));
};
