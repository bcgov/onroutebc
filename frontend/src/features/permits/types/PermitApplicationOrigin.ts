export const PERMIT_APPLICATION_ORIGINS = {
  ONLINE: "ONLINE",
  PPC: "PPC",
} as const;

export type PermitApplicationOrigin =
  (typeof PERMIT_APPLICATION_ORIGINS)[keyof typeof PERMIT_APPLICATION_ORIGINS];
