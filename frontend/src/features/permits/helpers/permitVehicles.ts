import { PERMIT_TYPES, PermitType } from "../types/PermitType";
import { sortVehicleSubtypes } from "./sorter";
import { LCV_VEHICLE_SUBTYPES } from "../constants/constants";
import { TROW_ELIGIBLE_VEHICLE_SUBTYPES } from "../constants/trow";
import { TROS_ELIGIBLE_VEHICLE_SUBTYPES } from "../constants/tros";
import { STOS_ELIGIBLE_VEHICLE_SUBTYPES } from "../constants/stos";
import { PermitLOA } from "../types/PermitLOA";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../common/helpers/util";
import { Nullable } from "../../../common/types/common";
import { DEFAULT_VEHICLE_TYPE, PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { EMPTY_VEHICLE_SUBTYPE } from "../../manageVehicles/helpers/vehicleSubtypes";
import {
  PowerUnit,
  Trailer,
  VehicleSubType,
  VEHICLE_TYPES,
  Vehicle,
} from "../../manageVehicles/types/Vehicle";

export const getEligibleVehicleSubtypes = (
  permitType: PermitType,
  isLcvDesignated: boolean,
) => {
  const lcvSubtypes = LCV_VEHICLE_SUBTYPES.map(({ typeCode }) => typeCode);
  switch (permitType) {
    case PERMIT_TYPES.STOS:
      return new Set(
        STOS_ELIGIBLE_VEHICLE_SUBTYPES.concat(isLcvDesignated ? lcvSubtypes : []),
      );
    case PERMIT_TYPES.TROW:
      return new Set(
        TROW_ELIGIBLE_VEHICLE_SUBTYPES.concat(isLcvDesignated ? lcvSubtypes : []),
      );
    case PERMIT_TYPES.TROS:
      return new Set(
        TROS_ELIGIBLE_VEHICLE_SUBTYPES.concat(isLcvDesignated ? lcvSubtypes : []),
      );
    default:
      return new Set<string>();
  }
};

/**
 * Gets default values for vehicle details, or populate with values from existing vehicle details.
 * @param vehicleDetails existing vehicle details, if any
 * @returns default values for vehicle details
 */
export const getDefaultVehicleDetails = (
  vehicleDetails?: Nullable<PermitVehicleDetails>,
) => ({
  vehicleId: getDefaultRequiredVal("", vehicleDetails?.vehicleId),
  unitNumber: getDefaultRequiredVal("", vehicleDetails?.unitNumber),
  vin: getDefaultRequiredVal("", vehicleDetails?.vin),
  plate: getDefaultRequiredVal("", vehicleDetails?.plate),
  make: getDefaultRequiredVal("", vehicleDetails?.make),
  year: applyWhenNotNullable((year) => year, vehicleDetails?.year, null),
  countryCode: getDefaultRequiredVal("", vehicleDetails?.countryCode),
  provinceCode: getDefaultRequiredVal("", vehicleDetails?.provinceCode),
  vehicleType: getDefaultRequiredVal(DEFAULT_VEHICLE_TYPE, vehicleDetails?.vehicleType),
  vehicleSubType: getDefaultRequiredVal("", vehicleDetails?.vehicleSubType),
  licensedGVW: getDefaultRequiredVal(null, vehicleDetails?.licensedGVW),
  saveVehicle: false,
});

/**
 * A helper method that filters allowed vehicle subtypes for dropdown lists.
 * @param allVehicleSubtypes List of all vehicle subtypes
 * @param allowedSubtypeCodes Set of allowed vehicle subtype codes
 * @returns List of only allowed vehicle subtypes
 */
export const getAllowedVehicleSubtypes = (
  allVehicleSubtypes: VehicleSubType[],
  allowedSubtypeCodes: Set<string>,
) => {
  return allVehicleSubtypes.filter(({ typeCode }) => allowedSubtypeCodes.has(typeCode));
};

/**
 * A helper method that filters only allowed vehicles from dropdown lists.
 * @param vehicles List of all vehicles (both eligible and ineligible)
 * @param eligibleSubtypes Set of eligible vehicle subtypes
 * @param loas LOAs that potentially allow certain non-allowed vehicles to be used
 * @returns List of only allowed vehicles
 */
export const getAllowedVehicles = (
  vehicles: Vehicle[],
  eligibleSubtypes: Set<string>,
  loas: PermitLOA[],
) => {
  const allowedLOAPowerUnitIds = new Set([
    ...loas.map(loa => loa.powerUnits)
      .reduce((prevPowerUnits, currPowerUnits) => [
        ...prevPowerUnits,
        ...currPowerUnits,
      ], []),
  ]);

  const allowedLOATrailerIds = new Set([
    ...loas.map(loa => loa.trailers)
      .reduce((prevTrailers, currTrailers) => [
        ...prevTrailers,
        ...currTrailers,
      ], []),
  ]);

  return vehicles.filter((vehicle) => {
    if (vehicle.vehicleType === VEHICLE_TYPES.TRAILER) {
      const trailer = vehicle as Trailer;
      return allowedLOATrailerIds.has(trailer.trailerId as string)
        || eligibleSubtypes.has(trailer.trailerTypeCode);
    }

    const powerUnit = vehicle as PowerUnit;
    return allowedLOAPowerUnitIds.has(powerUnit.powerUnitId as string)
      || eligibleSubtypes.has(powerUnit.powerUnitTypeCode);
  });
};

/**
 * Get vehicle subtype options for given vehicle type.
 * @param vehicleType Vehicle type
 * @param powerUnitSubtypes Vehicle subtypes for power units
 * @param trailerSubtypes Vehicle subtypes for trailers
 * @returns Correct vehicle subtype options for vehicle type
 */
export const getSubtypeOptions = (
  vehicleType: string,
  powerUnitSubtypes: VehicleSubType[],
  trailerSubtypes: VehicleSubType[],
) => {
  if (vehicleType === VEHICLE_TYPES.POWER_UNIT) {
    return [...powerUnitSubtypes];
  }
  if (vehicleType === VEHICLE_TYPES.TRAILER) {
    return [...trailerSubtypes];
  }
  return [EMPTY_VEHICLE_SUBTYPE];
};

/**
 * Get eligible subset of vehicle subtype options given lists of available subtypes and criteria.
 * @param powerUnitSubtypes All available power unit subtypes
 * @param trailerSubtypes All available trailer subtypes
 * @param eligibleSubtypeCodes Set of eligible vehicle subtype codes by default
 * @param allowedLOASubtypeCodes Set of vehicle subtypes allowed by selected LOAs
 * @param vehicleType Vehicle type
 * @returns Eligible subset of vehicle subtype options
 */
export const getEligibleSubtypeOptions = (
  powerUnitSubtypes: VehicleSubType[],
  trailerSubtypes: VehicleSubType[],
  eligibleSubtypesCodes: Set<string>,
  allowedLOASubtypeCodes: Set<string>,
  vehicleType?: string,
) => {
  if (
    vehicleType !== VEHICLE_TYPES.POWER_UNIT &&
    vehicleType !== VEHICLE_TYPES.TRAILER
  ) {
    return [EMPTY_VEHICLE_SUBTYPE];
  }

  // Sort vehicle subtypes alphabetically
  const sortedVehicleSubtypes = sortVehicleSubtypes(
    vehicleType,
    getSubtypeOptions(vehicleType, powerUnitSubtypes, trailerSubtypes),
  );

  return getAllowedVehicleSubtypes(
    sortedVehicleSubtypes,
    new Set([...eligibleSubtypesCodes, ...allowedLOASubtypeCodes]),
  );
};
