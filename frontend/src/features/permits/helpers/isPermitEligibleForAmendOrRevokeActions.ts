import {
  PERMIT_APPROVAL_SOURCES,
  PermitApprovalSource,
} from "../types/PermitApprovalSource";
import { PERMIT_STATUSES, PermitStatus } from "../types/PermitStatus";
import { Nullable } from "../../../common/types/common";

/**
 * Centralizes migrated-permit detection and the eligibility shared by Amend
 * and Void/Revoke menus and their direct-entry workflow guards.
 */
export const isMigratedPermit = (
  permitApprovalSource: Nullable<PermitApprovalSource>,
) => permitApprovalSource === PERMIT_APPROVAL_SOURCES.TPS;

export const isPermitEligibleForAmendOrRevokeActions = (
  permitStatus: PermitStatus,
  permitApprovalSource: Nullable<PermitApprovalSource>,
) =>
  permitStatus === PERMIT_STATUSES.ISSUED &&
  !isMigratedPermit(permitApprovalSource);
