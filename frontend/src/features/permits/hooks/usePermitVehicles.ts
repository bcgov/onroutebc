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
import { useMemoizedObject } from "../../../common/hooks/useMemoizedObject";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
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
      } : updatedVehicleDetails.updatedVehicle,
      filteredVehicleOptions: updatedVehicleDetails.filteredVehicleOptions,
    };
  }, [
    selectedLOAs,
    allVehiclesFromInventory,
    vehicleFormData,
    eligibleVehicleSubtypes,
    permitType,
    subtypeOptions,
  ]);

  // Updated vehicle should be memoized, otherwise placing the object directly in the dependency array
  // can cause infinite loops due to checking by reference (rather than by value)
  const memoizedUpdatedVehicle = useMemoizedObject(
    updatedVehicle,
    (v1, v2) => {
      return getDefaultRequiredVal("", v1.vehicleId) === getDefaultRequiredVal("", v2.vehicleId)
        && v1.countryCode === v2.countryCode
        && getDefaultRequiredVal(v1.licensedGVW) === getDefaultRequiredVal(v2.licensedGVW)
        && v1.make === v2.make
        && v1.plate === v2.plate
        && v1.provinceCode === v2.provinceCode
        && v1.vehicleType === v2.vehicleType
        && v1.vehicleSubType === v2.vehicleSubType
        && v1.vin === v2.vin
        && v1.year === v2.year;
    },
  );
  
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
