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
import { useMemoizedPermitVehicle } from "./useMemoizedPermitVehicle";
import {
  PowerUnit,
  Trailer,
  VEHICLE_TYPES,
} from "../../manageVehicles/types/Vehicle";

export const usePermitVehicles = ({
  policyEngine,
  permitType,
  vehicleFormData,
  allVehiclesFromInventory,
  selectedLOAs,
  powerUnitSubtypeNamesMap,
  trailerSubtypeNamesMap,
  onSetVehicle,
  selectedCommodity,
  saveVehicle,
}: {
  policyEngine: Policy;
  permitType: PermitType;
  vehicleFormData: PermitVehicleDetails;
  allVehiclesFromInventory: (PowerUnit | Trailer)[];
  selectedLOAs: PermitLOA[];
  powerUnitSubtypeNamesMap: Map<string, string>;
  trailerSubtypeNamesMap: Map<string, string>;
  onSetVehicle: (vehicleDetails: PermitVehicleDetails) => void;
  selectedCommodity?: Nullable<string>;
  saveVehicle?: Nullable<boolean>;
}) => {
  // Get the entire set of all eligible subtypes for the permit type
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
  
  const vehicleIdInForm = vehicleFormData.vehicleId;
  const vehicleType = vehicleFormData.vehicleType;
  const vehicleSubtype = vehicleFormData.vehicleSubType;

  // Get vehicle subtypes options based on current vehicle details in the form
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
      ...selectedLOAs.map((selectedLOA) => selectedLOA.vehicleSubType),
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

  // Get updated vehicle form details and vehicle inventory options if selected LOA has changed
  const {
    updatedVehicle,
    filteredVehicleOptions,
  } = useMemo(() => {
    const updatedVehicleDetails = getUpdatedVehicleDetailsForLOAs(
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

    // Make sure that the selected subtype is available as one of the select dropdown options,
    // Otherwise set the subtype to be the default first subtype in the dropdown list,
    // or set subtype to empty if no subtype options are available 
    return {
      updatedVehicle: !subtypeOptions.find(
        ({ typeCode }) => updatedVehicleDetails.updatedVehicle.vehicleSubType === typeCode,
      ) ? {
        ...updatedVehicleDetails.updatedVehicle,
        vehicleSubType: subtypeOptions.length > 0 ? subtypeOptions[0].typeCode : "",
        saveVehicle: isSelectedLOAVehicle ? false : saveVehicle,
      } : {
        ...updatedVehicleDetails.updatedVehicle,
        saveVehicle: isSelectedLOAVehicle ? false : saveVehicle,
      },
      filteredVehicleOptions: updatedVehicleDetails.filteredVehicleOptions,
    };
  }, [
    selectedLOAs,
    allVehiclesFromInventory,
    vehicleFormData,
    eligibleVehicleSubtypes,
    permitType,
    subtypeOptions,
    isSelectedLOAVehicle,
    saveVehicle,
  ]);

  // Updated vehicle should be memoized, otherwise placing the object directly in the dependency array
  // can cause infinite loops due to checking by reference (rather than by value)
  const memoizedUpdatedVehicle = useMemoizedPermitVehicle(updatedVehicle);
  
  // Update the vehicle section in the form whenever there is an update to the vehicle details
  useEffect(() => {
    onSetVehicle(memoizedUpdatedVehicle);
  }, [memoizedUpdatedVehicle]);

  return {
    filteredVehicleOptions,
    subtypeOptions,
    isSelectedLOAVehicle,
  };
};
