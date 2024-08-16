/**
 * Determine whether or not a vehicle subtype ic considered to be LCV.
 * @param subtype Vehicle subtype
 * @returns If the subtype is considered to be LCV vehicle subtype
 */
export const isVehicleSubtypeLCV = (subtype: string) => {
  return ["LCVRMDB", "LCVTPDB"].includes(subtype);
};
