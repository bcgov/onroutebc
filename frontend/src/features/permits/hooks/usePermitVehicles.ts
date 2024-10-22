import { useEffect, useMemo } from "react";

import { PermitType } from "../types/PermitType";
import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { getUpdatedVehicleDetailsForLOAs } from "../helpers/permitLOA";
import { PermitLOA } from "../types/PermitLOA";
import { getEligibleSubtypeOptions, getEligibleVehicleSubtypes } from "../helpers/permitVehicles";
import {
  PowerUnit,
  Trailer,
  VEHICLE_TYPES,
  VehicleSubType,
} from "../../manageVehicles/types/Vehicle";

export const usePermitVehicles = (
  permitType: PermitType,
  isLcvDesignated: boolean,
  vehicleFormData: PermitVehicleDetails,
  vehicleOptions: (PowerUnit | Trailer)[],
  selectedLOAs: PermitLOA[],
  powerUnitSubtypes: VehicleSubType[],
  trailerSubtypes: VehicleSubType[],
  onClearVehicle: () => void,
) => {
  const eligibleVehicleSubtypes = useMemo(() => getEligibleVehicleSubtypes(
    permitType,
    isLcvDesignated,
  ), [
    permitType,
    isLcvDesignated,
  ]);

  // Check to see if vehicle details is still valid after LOA has been deselected
  const {
    updatedVehicle,
    filteredVehicleOptions,
  } = useMemo(() => {
    return getUpdatedVehicleDetailsForLOAs(
      selectedLOAs,
      vehicleOptions,
      vehicleFormData,
      eligibleVehicleSubtypes,
    );
  }, [
    selectedLOAs,
    vehicleOptions,
    vehicleFormData,
    eligibleVehicleSubtypes,
  ]);

  const vehicleIdInForm = vehicleFormData.vehicleId;
  const updatedVehicleId = updatedVehicle.vehicleId;
  useEffect(() => {
    // If vehicle originally selected exists but the updated vehicle is cleared, clear the vehicle
    if (vehicleIdInForm && !updatedVehicleId) {
      onClearVehicle();
    }
  }, [
    vehicleIdInForm,
    updatedVehicleId,
  ]);

  // Get vehicle subtypes that are allowed by LOAs
  const vehicleType = vehicleFormData.vehicleType;
  const {
    subtypeOptions,
    isSelectedLOAVehicle,
  } = useMemo(() => {
    const allowedLOAPowerUnitIds = new Set([
      ...selectedLOAs.map(loa => loa.powerUnits)
        .reduce((prevPowerUnits, currPowerUnits) => [
          ...prevPowerUnits,
          ...currPowerUnits,
        ], []),
    ]);
  
    const allowedLOATrailerIds = new Set([
      ...selectedLOAs.map(loa => loa.trailers)
        .reduce((prevTrailers, currTrailers) => [
          ...prevTrailers,
          ...currTrailers,
        ], []),
    ]);
  
    // Try to find all of the unfiltered vehicles in the inventory, and get a list of their subtypes
    // as some of these unfiltered subtypes can potentially be used by a selected LOA
    const powerUnitsInInventory = vehicleOptions
      .filter(vehicle => vehicle.vehicleType === VEHICLE_TYPES.POWER_UNIT) as PowerUnit[];
  
    const trailersInInventory = vehicleOptions
      .filter(vehicle => vehicle.vehicleType === VEHICLE_TYPES.TRAILER) as Trailer[];
  
    const allowedLOASubtypes = new Set([
      ...powerUnitsInInventory
        .filter(powerUnit => allowedLOAPowerUnitIds.has(powerUnit.powerUnitId as string))
        .map(powerUnit => powerUnit.powerUnitTypeCode),
      ...trailersInInventory
        .filter(trailer => allowedLOATrailerIds.has(trailer.trailerId as string))
        .map(trailer => trailer.trailerTypeCode),
    ]);
  
    // Check if selected vehicle is an LOA vehicle
    const isSelectedLOAVehicle = Boolean(vehicleIdInForm)
      && (
        allowedLOAPowerUnitIds.has(vehicleIdInForm as string)
        || allowedLOATrailerIds.has(vehicleIdInForm as string)
      )
      && (
        powerUnitsInInventory.map(powerUnit => powerUnit.powerUnitId)
          .includes(vehicleIdInForm as string)
        || trailersInInventory.map(trailer => trailer.trailerId)
          .includes(vehicleIdInForm as string)
      );
  
    const subtypeOptions = getEligibleSubtypeOptions(
      powerUnitSubtypes,
      trailerSubtypes,
      eligibleVehicleSubtypes,
      allowedLOASubtypes,
      vehicleType,
    );

    return {
      subtypeOptions,
      isSelectedLOAVehicle,
    };
  }, [
    selectedLOAs,
    vehicleOptions,
    vehicleType,
    vehicleIdInForm,
    powerUnitSubtypes,
    trailerSubtypes,
    eligibleVehicleSubtypes,
  ]);

  return {
    filteredVehicleOptions,
    subtypeOptions,
    isSelectedLOAVehicle,
  };
};
