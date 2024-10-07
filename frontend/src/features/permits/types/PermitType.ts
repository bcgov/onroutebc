import { Nullable } from "../../../common/types/common";

export const PERMIT_TYPES = {
  /* SINGLE TRIP */
  // Single Trip Oversize
  STOS: "STOS",
  // Single Trip Oversize Overweight
  STWS: "STWS",
  // Single Trip Overweight / Increased GVW
  // TODO are these the same thing?
  STOW: "STOW",
  // Extra Provincial Temp Operating Permit
  EPTOP: "EPTOP",
  // Empty - Single Trip Over Length 27.5
  STOL: "STOL",
  // Rig Move
  RIG: "RIG",
  // Motive Fuel User Permit
  MFP: "MFP",

  /* TERM */
  // Term Oversize
  TROS: "TROS",
  // Term Overweight
  TROW: "TROW",
  // Highway Crossing
  // TODO should this be HWYX ?
  HC: "HC",
  // Axle Overweight
  // TODO is this still a valid permit type?
  TRAX: "TRAX",
  // Long Combination Vehicle
  // TODO is this still a valid permit type?
  LCV: "LCV",

  /* NON RESIDENT */
  // Quarterly ICBC Basic Insurance (FR)
  QRFR: "QRFR",
  // Quarterly Non-Resident
  QNRBS: "QNRBS",
  // Single Trip ICBC Basic Insurance (FR)
  STFR: "STFR",
  // Single Trip Non-Resident
  NRSCV: "NRSCV",
} as const;

export type PermitType = (typeof PERMIT_TYPES)[keyof typeof PERMIT_TYPES];

export const DEFAULT_PERMIT_TYPE = PERMIT_TYPES.TROS;
export const EMPTY_PERMIT_TYPE_SELECT = "Select";

/**
 * Returns the name/description of the permit type.
 * @param permitType String (if any) that represents the permit type
 * @returns Name/description of the permit type, or empty string if no mapping exists for permit type
 */
export const getPermitTypeName = (permitType?: Nullable<string>) => {
  switch (permitType) {
    /* SINGLE TRIP */
    case PERMIT_TYPES.STOS:
      return "Single Trip Oversize";
    case PERMIT_TYPES.STWS:
      return "Single Trip Overweight Oversize";
    case PERMIT_TYPES.STOW:
      return "Single Trip Over Weight";
    case PERMIT_TYPES.EPTOP:
      return "Extra-Provincial Temporary Operating";
    case PERMIT_TYPES.STOL:
      return "Single Trip Over Length";
    case PERMIT_TYPES.RIG:
      return "Rig Move";
    case PERMIT_TYPES.MFP:
      return "Motive Fuel User Permit";

    /* TERM */
    case PERMIT_TYPES.TROS:
      return "Term Oversize";
    case PERMIT_TYPES.TROW:
      return "Term Overweight";
    case PERMIT_TYPES.HC:
      return "Highway Crossing";
    case PERMIT_TYPES.TRAX:
      return "Term Axle Overweight";
    case PERMIT_TYPES.LCV:
      return "Long Combination Vehicle";

    /* NON-RESIDENT */
    case PERMIT_TYPES.NRSCV:
      return "Single Trip Non-Resident";
    case PERMIT_TYPES.QNRBS:
      return "Quarterly Non-Resident";
    case PERMIT_TYPES.QRFR:
      return "Quarterly ICBC Basic Insurance (FR)";
    case PERMIT_TYPES.STFR:
      return "Single Trip ICBC Basic Insurance (FR)";

    default:
      return "";
  }
};

/**
 * Returns the shortened name/description of the permit type.
 * @param permitType String (if any) that represents the permit type
 * @returns Short name/description of the permit type, or empty string if no mapping exists for permit type
 */
export const getPermitTypeShortName = (permitType?: Nullable<string>) => {
  switch (permitType) {
    /* SINGLE TRIP */
    case PERMIT_TYPES.STOS:
      return "Oversize";
    case PERMIT_TYPES.STWS:
      return "Oversize Overweight";
    case PERMIT_TYPES.STOW:
      return "Overweight";
    case PERMIT_TYPES.EPTOP:
      return "Extra-Provincial Temporary Operating";
    case PERMIT_TYPES.STOL:
      return "Over Length";
    case PERMIT_TYPES.RIG:
      return "Rig Move";
    case PERMIT_TYPES.MFP:
      return "Motive Fuel User Permit";

    /* TERM */
    case PERMIT_TYPES.TROS:
      return "Oversize";
    case PERMIT_TYPES.TROW:
      return "Overweight";
    case PERMIT_TYPES.HC:
      return "Highway Crossing";
    case PERMIT_TYPES.TRAX:
      return "Axle Overweight";
    case PERMIT_TYPES.LCV:
      return "Long Combination Vehicle";

    /* NON RESIDENT */
    case PERMIT_TYPES.QRFR:
      return "Quarterly ICBC Basic Insurance (FR)";
    case PERMIT_TYPES.QNRBS:
      return "Quarterly";
    case PERMIT_TYPES.STFR:
      return "Single Trip ICBC Basic Insurance (FR)";
    case PERMIT_TYPES.NRSCV:
      return "Single Trip";
    default:
      return "";
  }
};

/**
 * Gets display text for permit type.
 * @param permitType Permit type (eg. TROS, STOS, etc)
 * @returns display text for the permit type
 */
export const permitTypeDisplayText = (permitType?: Nullable<string>) => {
  switch (permitType) {
    /* SINGLE TRIP */
    case PERMIT_TYPES.STOS:
      return "Oversize: Single Trip";
    case PERMIT_TYPES.STWS:
      return "Oversize Overweight: Single Trip";
    case PERMIT_TYPES.STOW:
      return "Overweight: Single Trip";
    case PERMIT_TYPES.EPTOP:
      return "Extra-Provincial Temporary Operating: Single Trip";
    case PERMIT_TYPES.STOL:
      return "Over Length: Single Trip";
    case PERMIT_TYPES.RIG:
      return "Rig Move: Single Trip";
    case PERMIT_TYPES.MFP:
      return "Motive Fuel User Permit";

    /* TERM */
    case PERMIT_TYPES.TROS:
      return "Oversize: Term";
    case PERMIT_TYPES.TROW:
      return "Overweight: Term";
    case PERMIT_TYPES.HC:
      return "Highway Crossing: Term";
    case PERMIT_TYPES.TRAX:
      return "Axle Overweight: Term";
    case PERMIT_TYPES.LCV:
      return "Long Combination Vehicle: Term";

    /* NON RESIDENT */
    case PERMIT_TYPES.NRSCV:
      return "Single Trip: Non-Resident";
    case PERMIT_TYPES.QNRBS:
      return "Quarterly: Non-Resident";
    case PERMIT_TYPES.QRFR:
      return "Quarterly ICBC Basic Insurance (FR): Non-Resident";
    case PERMIT_TYPES.STFR:
      return "Single Trip ICBC Basic Insurance (FR): Non-Resident";

    default:
      return getPermitTypeName(permitType);
  }
};

/**
 * Determines whether or not a string represents a valid permit type.
 * @param permitType string representing permit type value, if it exists (eg. tros, trow, etc)
 * @returns true if string is a valid permit type, or false otherwise
 */
export const isPermitTypeValid = (permitType?: Nullable<string>) => {
  return (
    permitType &&
    (Object.values(PERMIT_TYPES) as string[]).includes(permitType.toUpperCase())
  );
};
