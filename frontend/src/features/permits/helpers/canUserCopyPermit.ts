import { Nullable } from "../../../common/types/common";
import { PERMIT_STATUSES, PermitStatus } from "../types/PermitStatus";
import { PERMIT_APPROVAL_SOURCES, PermitApprovalSource } from "../types/PermitApprovalSource";
import {
  IDIR_USER_ROLE,
  UserRoleType,
} from "../../../common/authentication/types";

import {
  PERMIT_APPLICATION_ORIGINS,
  PermitApplicationOrigin,
} from "../types/PermitApplicationOrigin";

/**
 * Determine whether or not a given user can copy a permit.
 * @param permitOrigin Permit origin
 * @param role Role of the logged in user
 * @param permitStatus Permit status
 * @returns Whether or not the user can copy the permit.
 */
export const canUserCopyPermit = (
  permitOrigin?: Nullable<PermitApplicationOrigin>,
  role?: Nullable<UserRoleType>,
  permitStatus?: Nullable<PermitStatus>,
  permitApprovalSource?: Nullable<PermitApprovalSource>,
) => {
  if (!role) return false;

  // No one can copy permits that are of status "Revoked", "Voided", or "Rejected"
  if (!permitStatus || ([
    PERMIT_STATUSES.REJECTED,
    PERMIT_STATUSES.VOIDED,
    PERMIT_STATUSES.REVOKED,
  ] as PermitStatus[]).includes(permitStatus)) {
    return false;
  }

  // No one can copy permits from TPS
  if (permitApprovalSource === PERMIT_APPROVAL_SOURCES.TPS) return false;

  // CV/PA can only copy permit whose origins are not "PPC"
  // Staff can copy any permit they have access to (including each others')
  return (
    permitOrigin !== PERMIT_APPLICATION_ORIGINS.PPC ||
    (Object.values(IDIR_USER_ROLE) as UserRoleType[]).includes(role)
  );
};
