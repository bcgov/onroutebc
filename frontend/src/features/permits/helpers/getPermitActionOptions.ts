import {
  PERMIT_ACTION_TYPES,
  PermitActionType,
} from "../types/PermitActionType";
import { PermitApprovalSource } from "../types/PermitApprovalSource";
import { PermitStatus } from "../types/PermitStatus";
import { getPermitActionLabel } from "./getPermitActionLabel";
import { isPermitEligibleForAmendOrRevokeActions } from "./isPermitEligibleForAmendOrRevokeActions";

export interface PermitActionPermissions {
  canResendPermit: boolean;
  canViewPermitReceipt: boolean;
  canViewExpiredPermitReceipt: boolean;
  canAmendPermit: boolean;
  canVoidPermit: boolean;
  canCopyPermit: boolean;
}

/**
 * Returns options for the row actions.
 * @returns Action options that can be performed for the permit.
 */
export const getPermitActionOptions = (
  permitActions: {
    action: PermitActionType;
    isAuthorized: boolean;
  }[],
) => {
  return permitActions
    .filter((action) => action.isAuthorized)
    .map(({ action }) => ({
      label: getPermitActionLabel(action),
      value: action,
    }));
};

export const getPermitRowActionOptions = ({
  isPermitInactiveOrExpired,
  permitStatus,
  permitApprovalSource,
  permissions,
}: {
  isPermitInactiveOrExpired: boolean;
  permitStatus: PermitStatus;
  permitApprovalSource: PermitApprovalSource;
  permissions: PermitActionPermissions;
}) => {
  const {
    canResendPermit,
    canViewPermitReceipt,
    canViewExpiredPermitReceipt,
    canAmendPermit,
    canVoidPermit,
    canCopyPermit,
  } = permissions;

  const isEligibleForAmendOrRevoke = isPermitEligibleForAmendOrRevokeActions(
    permitStatus,
    permitApprovalSource,
  );

  return getPermitActionOptions([
    {
      action: PERMIT_ACTION_TYPES.COPY,
      isAuthorized: canCopyPermit,
    },
    {
      action: PERMIT_ACTION_TYPES.RESEND,
      isAuthorized: canResendPermit,
    },
    {
      action: PERMIT_ACTION_TYPES.VIEW_RECEIPT,
      isAuthorized:
        (!isPermitInactiveOrExpired && canViewPermitReceipt) ||
        (isPermitInactiveOrExpired && canViewExpiredPermitReceipt),
    },
    {
      action: PERMIT_ACTION_TYPES.AMEND,
      isAuthorized: isEligibleForAmendOrRevoke && canAmendPermit,
    },
    {
      action: PERMIT_ACTION_TYPES.VOID_REVOKE,
      isAuthorized: isEligibleForAmendOrRevoke && canVoidPermit,
    },
  ]);
};
