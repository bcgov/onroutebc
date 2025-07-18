import dayjs, { Dayjs } from "dayjs";

import { LOADetail } from "../../settings/types/LOADetail";
import { isQuarterlyPermit, PermitType } from "../types/PermitType";
import { getEndOfDate, getStartOfDate, toLocalDayjs } from "../../../common/helpers/formatDate";
import { Nullable } from "../../../common/types/common";
import { Application, ApplicationFormData } from "../types/application";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { PowerUnit, Trailer, Vehicle, VEHICLE_TYPES } from "../../manageVehicles/types/Vehicle";
import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { getAllowedVehicles } from "./vehicles/getAllowedVehicles";
import { getDefaultVehicleDetails } from "./vehicles/getDefaultVehicleDetails";
import { PermitLOA } from "../types/PermitLOA";
import { isPermitVehicleWithinGvwLimit } from "./vehicles/rules/gvw";
import {
  durationOptionsForPermitType,
  getAvailableDurationOptions,
  getMinPermitExpiryDate,
  handleUpdateDurationIfNeeded,
} from "./dateSelection";
import { getUpdatedCLF } from "./conditionalLicensingFee/getUpdatedCLF";
import { getAvailableCLFs } from "./conditionalLicensingFee/getAvailableCLFs";
import { getVehicleWeightStatusForCLF } from "./vehicles/configuration/getVehicleWeightStatusForCLF";
import { getUpdatedVehicleWeights } from "./vehicles/configuration/getUpdatedVehicleWeights";
import { getExpiryDate } from "./permitState";

/**
 * Filter valid LOAs for a given permit type.
 * @param loas LOAs to filter
 * @param permitType The permit type that the LOA can be applicable for
 * @returns LOAs that can be applicable for the given permit type
 */
export const filterLOAsForPermitType = (
  loas: LOADetail[],
  permitType: PermitType,
) => {
  return loas.filter(loa => loa.loaPermitType.includes(permitType));
};

/**
 * Filter non-expired LOAs that do not expire before the start date of a permit. 
 * @param loas LOAs to filter
 * @param permitStart The start date of the permit
 * @returns LOAs that do not expire before the start date of the permit
 */
export const filterNonExpiredLOAs = (
  loas: LOADetail[],
  permitStart: Dayjs,
) => {
  return loas.filter(loa => (
    !loa.expiryDate
      || !permitStart.isAfter(
        getEndOfDate(toLocalDayjs(loa.expiryDate)),
      )
  ));
};

/**
 * Get the most recent expiry date for a list of LOAs.
 * @param loas LOAs with or without expiry dates
 * @returns The most recent expiry date for all the LOAs, or null if none of the LOAs expire
 */
export const getMostRecentExpiryFromLOAs = (loas: PermitLOA[]) => {
  const expiringLOAs = loas.filter(loa => Boolean(loa.expiryDate));
  if (expiringLOAs.length === 0) return null;

  const firstLOAExpiryDate = getEndOfDate(dayjs(expiringLOAs[0].expiryDate));
  return expiringLOAs.map(loa => loa.expiryDate)
    .reduce((prevExpiry, currExpiry) => {
      const prevExpiryDate = getEndOfDate(dayjs(prevExpiry));
      const currExpiryDate = getEndOfDate(dayjs(currExpiry));
      return prevExpiryDate.isAfter(currExpiryDate) ? currExpiryDate : prevExpiryDate;
    }, firstLOAExpiryDate);
};

/**
 * Get updated selectable LOAs with up-to-date information and selection state.
 * This removes non-existent selected LOAs, and updates any existing selected LOAs with up-to-date info.
 * @param upToDateLOAs Most recent up-to-date company LOAs
 * @param prevSelectedLOAs Previously selected LOAs
 * @param minPermitExpiryDate Min expiry date for a permit
 * @returns Updated list of selectable LOAs with up-to-date information and selection state
 */
export const getUpdatedLOASelection = (
  upToDateLOAs: LOADetail[],
  prevSelectedLOAs: PermitLOA[],
  minPermitExpiryDate: Dayjs,
  permitStartDate: Dayjs,
) => {
  // Each LOA should only be selected once, but there's a chance that an up-to-date LOA is also a previously selected LOA,
  // which means that LOA should only be shown once.
  // Thus, any overlapping LOA between the up-to-date LOAs and previously selected LOAs should only be included once,
  // and all non-overlapping LOAs that are not part of the up-to-date LOAs should be removed
  const prevSelectedLOANumbers = new Set([...prevSelectedLOAs.map(loa => loa.loaNumber)]);

  // Updated selection for LOAs, not including empty selection option "None"
  const updatedSelection = upToDateLOAs.map(loa => {
    const wasSelected = prevSelectedLOANumbers.has(loa.loaNumber);
    const isExpiringBeforeMinPermitExpiry = Boolean(loa.expiryDate)
      && minPermitExpiryDate.isAfter(getEndOfDate(dayjs(loa.expiryDate)));

    const isStartingAfterPermitStartDate =
      permitStartDate.isBefore(getStartOfDate(dayjs(loa.startDate)));

    // Deselect and disable any LOAs expiring before min permit expiry date,
    // or hasn't started yet (ie. LOA starts after permit start date)
    const isSelected = wasSelected
      && !isExpiringBeforeMinPermitExpiry
      && !isStartingAfterPermitStartDate;
    
    const isEnabled = !isExpiringBeforeMinPermitExpiry && !isStartingAfterPermitStartDate;
    
    return {
      loa: {
        loaId: loa.loaId,
        loaNumber: loa.loaNumber,
        companyId: loa.companyId,
        startDate: loa.startDate,
        expiryDate: loa.expiryDate,
        loaPermitType: loa.loaPermitType,
        vehicleType: loa.vehicleType,
        vehicleSubType: loa.vehicleSubType,
        originalLoaId: loa.originalLoaId,
        previousLoaId: loa.previousLoaId,
      },
      checked: isSelected,
      disabled: !isEnabled,
    };
  });

  // Empty LOA selection state
  const emptyLOASelection = {
    loa: null,
    checked: updatedSelection.filter(({ checked }) => checked).length === 0,
    disabled: false,
  };

  return [emptyLOASelection, ...updatedSelection];
};

/**
 * Get updated vehicle details and options based on selected LOAs.
 * @param selectedLOAs Selected LOAs for the permit
 * @param vehicleOptions Provided vehicle options for selection
 * @param prevSelectedVehicle Previously selected vehicle details in the permit form
 * @param eligibleSubtypes Set of all possible eligible vehicle subtypes
 * @param vehicleRestrictions Restriction rules that each vehicle must meet
 * @returns Updated vehicle details and filtered vehicle options
 */
export const getUpdatedVehicleDetailsForLOAs = (
  selectedLOAs: PermitLOA[],
  vehicleOptions: (PowerUnit | Trailer)[],
  prevSelectedVehicle: PermitVehicleDetails,
  eligibleSubtypes: Set<string>,
  vehicleRestrictions: ((vehicle: Vehicle) => boolean)[],
) => {
  const isLOAUsed = selectedLOAs.length > 0;

  const filteredVehicles = getAllowedVehicles(
    vehicleOptions,
    eligibleSubtypes,
    selectedLOAs,
    vehicleRestrictions,
  );

  // If an LOA is used, then the only allowable subtype is the one defined by the LOA
  // Otherwise, the allowable subtypes are the ones originally belonging to the permit type
  const allAllowableSubtypes = isLOAUsed
    ? new Set<string>([selectedLOAs[0].vehicleSubType])
    : eligibleSubtypes;

  // If vehicle selected is an existing vehicle (was originally chosen from inventory),
  // but its subtype is no longer valid, then clear the selected vehicle
  const { vehicleId, vehicleSubType } = prevSelectedVehicle;
  if (vehicleId && !allAllowableSubtypes.has(vehicleSubType)) {
    const defaultVehicleDetails = getDefaultVehicleDetails();

    return {
      filteredVehicleOptions: filteredVehicles,
      // If an LOA is used, fill the vehicle type and subtype with the LOA's vehicle type/subtype
      // Otherwise, simply clear the vehicle details and fill with default empty values
      updatedVehicle: isLOAUsed ? {
        ...defaultVehicleDetails,
        vehicleType: selectedLOAs[0].vehicleType,
        vehicleSubType: selectedLOAs[0].vehicleSubType,
      } : defaultVehicleDetails,
    };
  }

  return {
    filteredVehicleOptions: filteredVehicles,
    updatedVehicle: isLOAUsed ? {
      ...prevSelectedVehicle,
      vehicleType: selectedLOAs[0].vehicleType,
      vehicleSubType: selectedLOAs[0].vehicleSubType,
    } : prevSelectedVehicle,
  };
};

/**
 * Applying the most up-to-date LOA info to application data.
 * @param applicationData Existing application data
 * @param upToDateLOAs Most recent up-to-date company LOAs
 * @param inventoryVehicles Vehicle options from the inventory
 * @param eligibleVehicleSubtypes Set of eligible vehicle subtypes that can be used for vehicles
 * @param isStaff Whether or not the user who manages the application is staff
 * @returns Application data after applying the up-to-date LOAs
 */
export const applyUpToDateLOAsToApplication = <T extends Nullable<ApplicationFormData | Application>>(
  applicationData: T,
  upToDateLOAs: LOADetail[],
  inventoryVehicles: (PowerUnit | Trailer)[],
  eligibleVehicleSubtypes: Set<string>,
  isStaff: boolean,
): T => {
  // If application doesn't exist, no need to apply LOAs to it at all
  if (!applicationData) return applicationData;

  // Applicable LOAs must be:
  // 1. Applicable for the current permit type
  // 2. Have expiry date that is on or after the start date for an application
  const applicableLOAs = filterNonExpiredLOAs(
    filterLOAsForPermitType(
      getDefaultRequiredVal([], upToDateLOAs),
      applicationData.permitType,
    ),
    applicationData.permitData.startDate,
  );

  // Update selected LOAs in the permit data
  const prevSelectedLOAs = getDefaultRequiredVal([], applicationData.permitData.loas);
  const minPermitExpiryDate = getMinPermitExpiryDate(
    applicationData.permitType,
    applicationData.permitData.startDate,
  );

  const newSelectedLOAs = getUpdatedLOASelection(
    applicableLOAs,
    prevSelectedLOAs,
    minPermitExpiryDate,
    applicationData.permitData.startDate,
  )
    .filter(({ checked, loa }) => checked && Boolean(loa))
    .map(({ loa }) => loa) as PermitLOA[];

  // Update duration in permit if selected LOAs changed
  const durationOptions = getAvailableDurationOptions(
    durationOptionsForPermitType(applicationData.permitType, isStaff),
    newSelectedLOAs,
    applicationData.permitData.startDate,
  );

  const updatedDuration = handleUpdateDurationIfNeeded(
    applicationData.permitType,
    applicationData.permitData.permitDuration,
    durationOptions,
  );

  const updatedExpiryDate = getExpiryDate(
    applicationData.permitData.startDate,
    isQuarterlyPermit(applicationData.permitType),
    updatedDuration,
  );

  // Update vehicle details in permit if selected LOAs changed
  const { updatedVehicle } = getUpdatedVehicleDetailsForLOAs(
    newSelectedLOAs,
    inventoryVehicles,
    applicationData.permitData.vehicleDetails,
    eligibleVehicleSubtypes,
    [
      (v) => v.vehicleType !== VEHICLE_TYPES.POWER_UNIT
        || isPermitVehicleWithinGvwLimit(
          applicationData.permitType,
          VEHICLE_TYPES.POWER_UNIT,
          (v as PowerUnit).licensedGvw,
        ),
    ],
  );

  // Update conditional licensing fee and vehicle weights if vehicle subtype changed
  const availableCLFs = getAvailableCLFs(updatedVehicle.vehicleSubType);
  const updatedCLF = getUpdatedCLF(
    applicationData.permitType,
    availableCLFs,
    applicationData.permitData.conditionalLicensingFee,
  );
  
  const { enableLoadedGVW, enableNetWeight } = getVehicleWeightStatusForCLF(
    !updatedVehicle.vehicleSubType,
    updatedCLF,
  );
  
  const { updatedLoadedGVW, updatedNetWeight } = getUpdatedVehicleWeights(
    applicationData.permitType,
    enableLoadedGVW,
    enableNetWeight,
    applicationData.permitData.vehicleConfiguration?.loadedGVW,
    applicationData.permitData.vehicleConfiguration?.netWeight,
  );

  return {
    ...applicationData,
    permitData: {
      ...applicationData.permitData,
      permitDuration: updatedDuration,
      expiryDate: updatedExpiryDate,
      loas: newSelectedLOAs,
      vehicleDetails: updatedVehicle,
      conditionalLicensingFee: updatedCLF,
      vehicleConfiguration: applicationData.permitData.vehicleConfiguration ?
        {
          ...applicationData.permitData.vehicleConfiguration,
          loadedGVW: updatedLoadedGVW,
          netWeight: updatedNetWeight,
        } : null,
    },
  };
};
