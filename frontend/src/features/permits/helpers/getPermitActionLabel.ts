import {
  PERMIT_ACTION_TYPES,
  PermitActionType,
} from "../types/PermitActionType";

export const getPermitActionLabel = (actionType: PermitActionType) => {
  switch (actionType) {
    case PERMIT_ACTION_TYPES.RESEND:
      return "Resend";
    case PERMIT_ACTION_TYPES.VIEW_RECEIPT:
      return "View Receipt";
    case PERMIT_ACTION_TYPES.AMEND:
      return "Amend";
    case PERMIT_ACTION_TYPES.VOID_REVOKE:
      return "Void/Revoke";
    default:
      return "";
  }
};
