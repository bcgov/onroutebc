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
import { useApplicationFormUpdateMethods } from "./form/useApplicationFormUpdateMethods";
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
  selectedCommodity,
}: {
  policyEngine: Policy;
  permitType: PermitType;
  vehicleFormData: PermitVehicleDetails;
  allVehiclesFromInventory: (PowerUnit | Trailer)[];
  selectedLOAs: PermitLOA[];
  powerUnitSubtypeNamesMap: Map<string, string>;
  trailerSubtypeNamesMap: Map<string, string>;
  selectedCommodity?: Nullable<string>;
}) => {
  const {
    onSetVin,
    onSetPlate,
    onSetMake,
    onSetYear,
    onSetCountryCode,
    onSetProvinceCode,
    onSetVehicleType,
    onSetVehicleSubtype,
    onSetUnitNumber,
    onSetVehicleId,
    onSetLicensedGVW,
    onToggleSaveVehicle,
  } = useApplicationFormUpdateMethods();

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
  
  const {
    vin: vinInForm,
    plate: plateInForm,
    make: makeInForm,
    year: yearInForm,
    countryCode: countryCodeInForm,
    provinceCode: provinceCodeInForm,
    vehicleType: vehicleTypeInForm,
    vehicleSubType: vehicleSubtypeInForm,
    saveVehicle: saveVehicleInForm,
    unitNumber: unitNumberInForm,
    vehicleId: vehicleIdInForm,
    licensedGVW: licensedGVWInForm,
  } = vehicleFormData;

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
        allowedLOASubtypes.has(vehicleSubtypeInForm)
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
      vehicleTypeInForm,
    );

    return {
      subtypeOptions,
      isSelectedLOAVehicle,
    };
  }, [
    selectedLOAs,
    allVehiclesFromInventory,
    vehicleTypeInForm,
    vehicleSubtypeInForm,
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
      {
        vin: vinInForm,
        plate: plateInForm,
        make: makeInForm,
        year: yearInForm,
        countryCode: countryCodeInForm,
        provinceCode: provinceCodeInForm,
        vehicleType: vehicleTypeInForm,
        vehicleSubType: vehicleSubtypeInForm,
        saveVehicle: saveVehicleInForm,
        unitNumber: unitNumberInForm,
        vehicleId: vehicleIdInForm,
        licensedGVW: licensedGVWInForm,
      },
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
        saveVehicle: isSelectedLOAVehicle ? false : saveVehicleInForm,
      } : {
        ...updatedVehicleDetails.updatedVehicle,
        saveVehicle: isSelectedLOAVehicle ? false : saveVehicleInForm,
      },
      filteredVehicleOptions: updatedVehicleDetails.filteredVehicleOptions,
    };
  }, [
    selectedLOAs,
    allVehiclesFromInventory,
    vinInForm,
    plateInForm,
    makeInForm,
    yearInForm,
    countryCodeInForm,
    provinceCodeInForm,
    vehicleTypeInForm,
    vehicleSubtypeInForm,
    saveVehicleInForm,
    unitNumberInForm,
    vehicleIdInForm,
    licensedGVWInForm,
    eligibleVehicleSubtypes,
    permitType,
    subtypeOptions,
    isSelectedLOAVehicle,
    saveVehicleInForm,
  ]);

  const {
    vin: updatedVin,
    plate: updatedPlate,
    make: updatedMake,
    year: updatedYear,
    countryCode: updatedCountryCode,
    provinceCode: updatedProvinceCode,
    vehicleType: updatedVehicleType,
    vehicleSubType: updatedVehicleSubtype,
    saveVehicle: updatedSaveVehicle,
    unitNumber: updatedUnitNumber,
    vehicleId: updatedVehicleId,
    licensedGVW: updatedLicensedGVW,
  } = updatedVehicle;

  // If the fields in the updated vehicle details differ from the ones already in
  // the form, update each of those fields individually
  // This is to mitigate an infinite-render issue where the entire vehicle details is set
  // ie. the vehicle details reference is updated
  // By updating the each specific field on a case-by-case basis, the vehicle details remains
  // the same while only its members are updated, preventing an infinite loop
  useEffect(() => {
    if (vehicleIdInForm !== updatedVehicleId) {
      onSetVehicleId(updatedVehicleId);
    }
  }, [vehicleIdInForm, updatedVehicleId]);

  useEffect(() => {
    if (unitNumberInForm !== updatedUnitNumber) {
      onSetUnitNumber(updatedUnitNumber);
    }
  }, [unitNumberInForm, updatedUnitNumber]);

  useEffect(() => {
    if (vinInForm !== updatedVin) {
      onSetVin(updatedVin);
    }
  }, [vinInForm, updatedVin]);

  useEffect(() => {
    if (vinInForm !== updatedVin) {
      onSetVin(updatedVin);
    }
  }, [vinInForm, updatedVin]);

  useEffect(() => {
    if (plateInForm !== updatedPlate) {
      onSetPlate(updatedPlate);
    }
  }, [plateInForm, updatedPlate]);

  useEffect(() => {
    if (makeInForm !== updatedMake) {
      onSetMake(updatedMake);
    }
  }, [makeInForm, updatedMake]);

  useEffect(() => {
    if (yearInForm !== updatedYear) {
      onSetYear(updatedYear);
    }
  }, [yearInForm, updatedYear]);

  useEffect(() => {
    if (countryCodeInForm !== updatedCountryCode) {
      onSetCountryCode(updatedCountryCode);
    }
  }, [countryCodeInForm, updatedCountryCode]);

  useEffect(() => {
    if (provinceCodeInForm !== updatedProvinceCode) {
      onSetProvinceCode(updatedProvinceCode);
    }
  }, [provinceCodeInForm, updatedProvinceCode]);

  useEffect(() => {
    if (
      getDefaultRequiredVal(0, licensedGVWInForm)
      !== getDefaultRequiredVal(0, updatedLicensedGVW)
    ) {
      onSetLicensedGVW(updatedLicensedGVW);
    }
  }, [licensedGVWInForm, updatedLicensedGVW]);

  useEffect(() => {
    if (saveVehicleInForm !== updatedSaveVehicle) {
      onToggleSaveVehicle(Boolean(updatedSaveVehicle));
    }
  }, [saveVehicleInForm, updatedSaveVehicle]);

  useEffect(() => {
    if (vehicleSubtypeInForm !== updatedVehicleSubtype) {
      onSetVehicleSubtype(updatedVehicleSubtype);
    }
  }, [vehicleSubtypeInForm, updatedVehicleSubtype]);

  useEffect(() => {
    if (vehicleTypeInForm !== updatedVehicleType) {
      onSetVehicleType(updatedVehicleType);
    }
  }, [vehicleTypeInForm, updatedVehicleType]);

  return {
    filteredVehicleOptions,
    subtypeOptions,
    isSelectedLOAVehicle,
  };
};
