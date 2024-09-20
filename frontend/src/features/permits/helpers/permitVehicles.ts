import { PERMIT_TYPES, PermitType } from "../types/PermitType";
import { TROW_INELIGIBLE_POWERUNITS, TROW_INELIGIBLE_TRAILERS } from "../constants/trow";
import { TROS_INELIGIBLE_POWERUNITS, TROS_INELIGIBLE_TRAILERS } from "../constants/tros";
import {
  PowerUnit,
  Trailer,
  VehicleSubType,
  VehicleType,
  VEHICLE_TYPES,
  Vehicle,
} from "../../manageVehicles/types/Vehicle";
import { LOADetail } from "../../settings/types/SpecialAuthorization";

export const getIneligiblePowerUnitSubtypes = (permitType: PermitType) => {
  switch (permitType) {
    case PERMIT_TYPES.TROW:
      return TROW_INELIGIBLE_POWERUNITS;
    case PERMIT_TYPES.TROS:
      return TROS_INELIGIBLE_POWERUNITS;
    default:
      return [];
  }
};

export const getIneligibleTrailerSubtypes = (permitType: PermitType) => {
  switch (permitType) {
    case PERMIT_TYPES.TROW:
      return TROW_INELIGIBLE_TRAILERS;
    case PERMIT_TYPES.TROS:
      return TROS_INELIGIBLE_TRAILERS;
    default:
      return [];
  }
};

/**
 * A helper method that filters eligible power unit or trailer subtypes for dropdown lists.
 * @param allVehicleSubtypes List of both eligible and ineligible vehicle subtypes
 * @param vehicleType Type of vehicle
 * @param ineligiblePowerUnitSubtypes List of provided ineligible power unit subtypes
 * @param ineligibleTrailerSubtypes List of provided ineligible trailer subtypes
 * @param allowedPowerUnitSubtypes List of provided allowed power unit subtypes
 * @param allowedTrailerSubtypes List of provided allowed trailer subtypes
 * @returns List of only eligible power unit or trailer subtypes
 */
export const filterVehicleSubtypes = (
  allVehicleSubtypes: VehicleSubType[],
  vehicleType: VehicleType,
  ineligiblePowerUnitSubtypes: VehicleSubType[],
  ineligibleTrailerSubtypes: VehicleSubType[],
  allowedPowerUnitSubtypes: string[],
  allowedTrailerSubtypes: string[],
) => {
  const ineligibleSubtypes = vehicleType === VEHICLE_TYPES.TRAILER
    ? ineligibleTrailerSubtypes : ineligiblePowerUnitSubtypes;

  const allowedSubtypes = vehicleType === VEHICLE_TYPES.TRAILER
    ? allowedTrailerSubtypes : allowedPowerUnitSubtypes;

  return allVehicleSubtypes.filter((vehicleSubtype) => {
    return allowedSubtypes.some(
      allowedSubtype => vehicleSubtype.typeCode === allowedSubtype
    ) || !ineligibleSubtypes.some(
      (ineligibleSubtype) => vehicleSubtype.typeCode === ineligibleSubtype.typeCode,
    );
  });
};

/**
 * A helper method that filters power unit or trailer vehicles from dropdown lists.
 * @param vehicles List of both eligible and ineligible vehicles
 * @param ineligiblePowerUnitSubtypes List of ineligible power unit subtypes
 * @param ineligibleTrailerSubtypes List of ineligible trailer subtypes
 * @param loas LOAs that potentially bypass ineligible vehicle restrictions
 * @returns List of only eligible vehicles
 */
export const filterVehicles = (
  vehicles: Vehicle[],
  ineligiblePowerUnitSubtypes: VehicleSubType[],
  ineligibleTrailerSubtypes: VehicleSubType[],
  loas: LOADetail[],
) => {
  const permittedPowerUnitIds = new Set([
    ...loas.map(loa => loa.powerUnits)
      .reduce((prevPowerUnits, currPowerUnits) => [
        ...prevPowerUnits,
        ...currPowerUnits,
      ], []),
  ]);

  const permittedTrailerIds = new Set([
    ...loas.map(loa => loa.trailers)
      .reduce((prevTrailers, currTrailers) => [
        ...prevTrailers,
        ...currTrailers,
      ], []),
  ]);

  return vehicles.filter((vehicle) => {
    if (vehicle.vehicleType === VEHICLE_TYPES.TRAILER) {
      const trailer = vehicle as Trailer;
      return permittedTrailerIds.has(trailer.trailerId as string)
        || !ineligibleTrailerSubtypes.some((ineligibleSubtype) => {
          return trailer.trailerTypeCode === ineligibleSubtype.typeCode;
        });
    }

    const powerUnit = vehicle as PowerUnit;
    return permittedPowerUnitIds.has(powerUnit.powerUnitId as string)
      || !ineligiblePowerUnitSubtypes.some((ineligibleSubtype) => {
        return powerUnit.powerUnitTypeCode === ineligibleSubtype.typeCode;
      });
  });
};
