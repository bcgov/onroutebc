import {
  PERMIT_APPROVAL_SOURCES,
  PermitApprovalSource,
} from "../types/PermitApprovalSource";
import { PERMIT_STATUSES, PermitStatus } from "../types/PermitStatus";

/**
 * Centralizes migrated-permit detection and the eligibility shared by Amend
 * and Void/Revoke menus and their direct-entry workflow guards.
 */
export const isMigratedPermit = (
  permitApprovalSource?: PermitApprovalSource | null,
) => permitApprovalSource === PERMIT_APPROVAL_SOURCES.TPS;

export const isPermitEligibleForAmendOrRevokeActions = (
  permitStatus: PermitStatus,
  permitApprovalSource?: PermitApprovalSource | null,
) =>
  permitStatus === PERMIT_STATUSES.ISSUED &&
  !isMigratedPermit(permitApprovalSource);
