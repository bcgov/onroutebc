import { Nullable } from "../../../common/types/common";

export const PERMIT_TYPES = {
  EPTOP: "EPTOP",
  HC: "HC",
  LCV: "LCV",
  MFP: "MFP",
  // NO LONGER USED
  // NRQBS: "NRQBS",
  // NRQCL: "NRQCL",
  // NRQCV: "NRQCV",
  // NRQFT: "NRQFT",
  // NRQFV: "NRQFV",
  // NRQXP: "NRQXP",
  // NRSBS: "NRSBS",
  // NRSCL: "NRSCL",
  // NRSCV: "NRSCV",
  // NRSFT: "NRSFT",
  // NRSFV: "NRSFV",
  // NRSXP: "NRSXP",
  RIG: "RIG",
  STOL: "STOL",
  STOS: "STOS",
  STOW: "STOW",
  STWS: "STWS",
  TRAX: "TRAX",
  TROS: "TROS",
  TROW: "TROW",
} as const;

export type PermitType = (typeof PERMIT_TYPES)[keyof typeof PERMIT_TYPES];

export const DEFAULT_PERMIT_TYPE = PERMIT_TYPES.TROS;
export const EMPTY_PERMIT_TYPE_SELECT = "select";

/**
 * Returns the name/description of the permit type.
 * @param permitType String (if any) that represents the permit type
 * @returns Name/description of the permit type, or empty string if no mapping exists for permit type
 */
export const getPermitTypeName = (permitType?: Nullable<string>) => {
  switch (permitType) {
    case PERMIT_TYPES.EPTOP:
      return "Extra-Provincial Temporary Operating";
    case PERMIT_TYPES.HC:
      return "Highway Crossing";
    case PERMIT_TYPES.LCV:
      return "Long Combination Vehicle";
    case PERMIT_TYPES.MFP:
      return "Motive Fuel User";

    // NO LONGER USED
    // case PERMIT_TYPES.NRQBS:
    //   return "Quarterly Non Resident Reg. / Ins. - Bus";
    // case PERMIT_TYPES.NRQCL:
    //   return "Non Resident Quarterly Conditional License";
    // case PERMIT_TYPES.NRQCV:
    //   return "Quarterly Non Resident Reg. / Ins. - Comm Vehicle";
    // case PERMIT_TYPES.NRQFT:
    //   return "Non Resident Quarterly Farm Tractor";
    // case PERMIT_TYPES.NRQFV:
    //   return "Quarterly Non Resident Reg. / Ins. - Farm Vehicle";
    // case PERMIT_TYPES.NRQXP:
    //   return "Non Resident Quarterly X Plated";
    // case PERMIT_TYPES.NRSBS:
    //   return "Single Trip Non-Resident Registration / Insurance - Buses";
    // case PERMIT_TYPES.NRSCL:
    //   return "Non Resident Single Trip Conditional License";
    // case PERMIT_TYPES.NRSCV:
    //   return "Single Trip Non-Resident Reg. / Ins. - Commercial Vehicle";
    // case PERMIT_TYPES.NRSFT:
    //   return "Non Resident Farm Tractor Single Trip";
    // case PERMIT_TYPES.NRSFV:
    //   return "Single Trip Non-Resident Reg. / Ins. - Farm Vehicle";
    // case PERMIT_TYPES.NRSXP:
    //   return "Non Resident Single Trip X Plated Vehicle";

    case PERMIT_TYPES.RIG:
      return "Rig Move";
    case PERMIT_TYPES.STOL:
      return "Single Trip Over Length";
    case PERMIT_TYPES.STOS:
      return "Single Trip Oversize";
    case PERMIT_TYPES.STOW:
      return "Single Trip Over Weight";
    case PERMIT_TYPES.STWS:
      return "Single Trip Overweight Oversize";
    case PERMIT_TYPES.TRAX:
      return "Term Axle Overweight";
    case PERMIT_TYPES.TROS:
      return "Term Oversize";
    case PERMIT_TYPES.TROW:
      return "Term Overweight";
    default:
      return "";

    // NON RESIDENT LIST
    // Quarterly Non-Resident
    // Single Trip Non-Resident
    // Quarterly ICBC Basic Insurance (FR)
    // Single Trip ICBC Basic Insurance (FR)

    // SINGLE TRIP LIST
    // Single Trip Oversize
    // Single Trip Oversize Overweight
    // Single Trip Overweight
    // Extra Provincial Temp Operating Permit
    // Empty - Single Trip Over Length 27.5
    // Increased GVW
    // Rig Move
    // Motive Fuel User Permit

    // TERM LIST
    // Term Oversize
    // Term Overweight
    // Highway Crossing
  }
};

/**
 * Gets display text for permit type.
 * @param permitType Permit type (eg. TROS, STOS, etc)
 * @returns display text for the permit type
 */
export const permitTypeDisplayText = (permitType?: Nullable<string>) => {
  switch (permitType) {
    case PERMIT_TYPES.TROS:
      return "Oversize: Term";
    case PERMIT_TYPES.STOS:
      return "Oversize: Single Trip";
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
