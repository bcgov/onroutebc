export enum PermitType {
  SINGLE_TRIP_OVERSIZE = 'STOS',
  TERM_OVERSIZE = 'TROS',
}

export enum ExtendedPermitType {
  ALL = 'ALL',
}

export const PermitTypeReport = {
  ...PermitType,
  ...ExtendedPermitType,
};

export type PermitTypeReport =
  (typeof PermitTypeReport)[keyof typeof PermitTypeReport];
