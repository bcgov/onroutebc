import { PermitType } from '../enum/permit-type.enum';

export const PERMIT_TYPES_FOR_QUEUE: readonly PermitType[] = [
  PermitType.SINGLE_TRIP_OVERSIZE,
];

export const STOS_MAX_ALLOWED_DURATION_AMEND = 30;

export const DEFAULT_STAFF_MAX_ALLOWED_START_DATE = 60;
