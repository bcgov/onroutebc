/**
 * The location from where the permit action (amend/void/revoke/copy) originated
 */
export const PERMIT_ACTION_ORIGINS = {
  GLOBAL_SEARCH: "globalSearch",
  ACTIVE_PERMITS: "activePermits",
  EXPIRED_PERMITS: "expiredPermits",
  AIP: "applicationsInProgress",
};

export type PermitActionOrigin =
  (typeof PERMIT_ACTION_ORIGINS)[keyof typeof PERMIT_ACTION_ORIGINS];
