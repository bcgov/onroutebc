import { useEffect, useMemo } from "react";
import { Policy } from "onroute-policy-engine";

import { PermitType } from "../types/PermitType";
import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { getUpdatedVehicleDetailsForLOAs } from "../helpers/permitLOA";
import { PermitLOA } from "../types/PermitLOA";
import { getEligibleSubtypeOptions } from "../helpers/vehicles/subtypes/getEligibleSubtypeOptions";
import { Nullable } from "../../../common/types/common";
import { getEligibleVehicleSubtypes } from "../helpers/vehicles/subtypes/getEligibleVehicleSubtypes";
import { isPermitVehicleWithinGvwLimit } from "../helpers/vehicles/rules/gvw";
import {
  PowerUnit,
  Trailer,
  VEHICLE_TYPES,
} from "../../manageVehicles/types/Vehicle";

export const usePermitVehicles = (
  data: {
    policyEngine: Policy;
    permitType: PermitType;
    vehicleFormData: PermitVehicleDetails;
    allVehiclesFromInventory: (PowerUnit | Trailer)[];
    selectedLOAs: PermitLOA[];
    powerUnitSubtypeNamesMap: Map<string, string>;
    trailerSubtypeNamesMap: Map<string, string>;
    onClearVehicle: () => void;
    selectedCommodity?: Nullable<string>;
  },
) => {
  const {
    policyEngine,
    permitType,
    vehicleFormData,
    allVehiclesFromInventory,
    selectedLOAs,
    powerUnitSubtypeNamesMap,
    trailerSubtypeNamesMap,
    onClearVehicle,
    selectedCommodity,
  } = data;

  const eligibleVehicleSubtypes = useMemo(() => {
    return getEligibleVehicleSubtypes(
      permitType,
      selectedCommodity,
      policyEngine,
    );
  }, [
    policyEngine,
    permitType,
    selectedCommodity,
  ]);

  // Check to see if vehicle details is still valid after LOA has been deselected
  const {
    updatedVehicle,
    filteredVehicleOptions,
  } = useMemo(() => {
    return getUpdatedVehicleDetailsForLOAs(
      selectedLOAs,
      allVehiclesFromInventory,
      vehicleFormData,
      eligibleVehicleSubtypes,
      [
        (v) => v.vehicleType !== VEHICLE_TYPES.POWER_UNIT
          || isPermitVehicleWithinGvwLimit(
            permitType,
            VEHICLE_TYPES.POWER_UNIT,
            (v as PowerUnit).licensedGvw,
          ),
      ],
    );
  }, [
    selectedLOAs,
    allVehiclesFromInventory,
    vehicleFormData,
    eligibleVehicleSubtypes,
    permitType,
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
  const vehicleSubtype = vehicleFormData.vehicleSubType;
  const {
    subtypeOptions,
    isSelectedLOAVehicle,
  } = useMemo(() => {
    // Try to find all of the unfiltered vehicles in the inventory, and get a list of their subtypes
    // as some of these unfiltered subtypes can potentially be used by a selected LOA
    const powerUnitsInInventory = allVehiclesFromInventory
      .filter(vehicle => vehicle.vehicleType === VEHICLE_TYPES.POWER_UNIT) as PowerUnit[];
  
    const trailersInInventory = allVehiclesFromInventory
      .filter(vehicle => vehicle.vehicleType === VEHICLE_TYPES.TRAILER) as Trailer[];
  
    const allowedLOASubtypes = new Set([
      ...selectedLOAs.map((selectedLOA) => selectedLOA.vehicleSubtype),
    ]);
  
    // Check if selected vehicle is an LOA vehicle
    const isSelectedLOAVehicle = selectedLOAs.length > 0
      && Boolean(vehicleIdInForm)
      && (
        allowedLOASubtypes.has(vehicleSubtype)
      )
      && (
        powerUnitsInInventory.map(powerUnit => powerUnit.powerUnitId)
          .includes(vehicleIdInForm as string)
        || trailersInInventory.map(trailer => trailer.trailerId)
          .includes(vehicleIdInForm as string)
      );
  
    const subtypeOptions = getEligibleSubtypeOptions(
      [...powerUnitSubtypeNamesMap.entries()].map(([typeCode, type]) => ({
        type,
        typeCode,
        description: "",
      })),
      [...trailerSubtypeNamesMap.entries()].map(([typeCode, type]) => ({
        type,
        typeCode,
        description: "",
      })),
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
    allVehiclesFromInventory,
    vehicleType,
    vehicleSubtype,
    vehicleIdInForm,
    powerUnitSubtypeNamesMap,
    trailerSubtypeNamesMap,
    eligibleVehicleSubtypes,
  ]);

  return {
    filteredVehicleOptions,
    subtypeOptions,
    isSelectedLOAVehicle,
  };
};
