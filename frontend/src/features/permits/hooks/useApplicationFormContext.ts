import { useContext } from "react";

import { ApplicationFormContext } from "../context/ApplicationFormContext";
import { usePermitDateSelection } from "./usePermitDateSelection";
import { usePermitConditions } from "./usePermitConditions";
import { getStartOfDate } from "../../../common/helpers/formatDate";
import { getIneligibleSubtypes } from "../helpers/permitVehicles";
import { usePermitVehicleForLOAs } from "./usePermitVehicleForLOAs";
import { arePermitLOADetailsEqual, PermitLOA } from "../types/PermitLOA";
import { useMemoizedArray } from "../../../common/hooks/useMemoizedArray";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { arePermitConditionEqual } from "../types/PermitCondition";
import { useMemoizedObject } from "../../../common/hooks/useMemoizedObject";

export const useApplicationFormContext = () => {
  const {
    initialFormData,
    formData,
    durationOptions,
    vehicleOptions,
    powerUnitSubtypes,
    trailerSubtypes,
    isLcvDesignated,
    feature,
    companyInfo,
    isAmendAction,
    createdDateTime,
    updatedDateTime,
    pastStartDateStatus,
    companyLOAs,
    revisionHistory,
    onLeave,
    onSave,
    onCancel,
    onContinue,
    onSetDuration,
    onSetExpiryDate,
    onSetConditions,
    onToggleSaveVehicle,
    onSetVehicle,
    onClearVehicle,
    onUpdateLOAs,
  } = useContext(ApplicationFormContext);

  const {
    permitType,
    applicationNumber,
    permitNumber,
  } = formData;

  const {
    expiryDate: permitExpiryDate,
    loas,
    permitDuration,
    startDate: permitStartDate,
    commodities,
    vehicleDetails: vehicleFormData,
  } = formData.permitData;

  const startDate = useMemoizedObject(
    getStartOfDate(permitStartDate),
    (dateObj1, dateObj2) => dateObj1.isSame(dateObj2),
  );

  const expiryDate = useMemoizedObject(
    permitExpiryDate,
    (dateObj1, dateObj2) => dateObj1.isSame(dateObj2),
  );

  const currentSelectedLOAs = useMemoizedArray(
    getDefaultRequiredVal([], loas),
    ({ loaNumber }) => loaNumber,
    arePermitLOADetailsEqual,
  );

  const permitConditions = useMemoizedArray(
    commodities,
    ({ condition }) => condition,
    arePermitConditionEqual,
  );

  // Update duration options and expiry when needed
  const { availableDurationOptions } = usePermitDateSelection(
    permitType,
    startDate,
    durationOptions,
    currentSelectedLOAs as PermitLOA[],
    permitDuration,
    onSetDuration,
    onSetExpiryDate,
  );
  
  // Update permit conditions when LCV designation or vehicle subtype changes
  const { allConditions } = usePermitConditions(
    permitType,
    permitConditions,
    isLcvDesignated,
    vehicleFormData.vehicleSubType,
    onSetConditions,
  );

  // Check to see if vehicle details is still valid after LOA has been deselected
  const ineligibleSubtypes = getIneligibleSubtypes(permitType, isLcvDesignated);
  const ineligiblePowerUnitSubtypes = useMemoizedArray(
    ineligibleSubtypes.ineligiblePowerUnitSubtypes,
    (subtype) => subtype.typeCode,
    (subtype1, subtype2) => subtype1.typeCode === subtype2.typeCode,
  );

  const ineligibleTrailerSubtypes = useMemoizedArray(
    ineligibleSubtypes.ineligibleTrailerSubtypes,
    (subtype) => subtype.typeCode,
    (subtype1, subtype2) => subtype1.typeCode === subtype2.typeCode,
  );

  const ineligiblePowerUnitSubtypeCodes = useMemoizedArray(
    ineligiblePowerUnitSubtypes.map(({ typeCode }) => typeCode),
    (typeCode) => typeCode,
    (typeCode1, typeCode2) => typeCode1 === typeCode2,
  );

  const ineligibleTrailerSubtypeCodes = useMemoizedArray(
    ineligibleTrailerSubtypes.map(({ typeCode }) => typeCode),
    (typeCode) => typeCode,
    (typeCode1, typeCode2) => typeCode1 === typeCode2,
  );

  const { filteredVehicleOptions } = usePermitVehicleForLOAs(
    vehicleFormData,
    vehicleOptions,
    currentSelectedLOAs as PermitLOA[],
    ineligiblePowerUnitSubtypeCodes,
    ineligibleTrailerSubtypeCodes,
    () => onClearVehicle(Boolean(vehicleFormData.saveVehicle)),
  );

  const memoizedCompanyLOAs = useMemoizedArray(
    companyLOAs,
    ({ loaNumber }) => loaNumber,
    arePermitLOADetailsEqual,
  );

  const memoizedRevisionHistory = useMemoizedArray(
    revisionHistory,
    (historyItem) => `${historyItem.permitId}-${historyItem.revisionDateTime}`,
    (historyItem1, historyItem2) =>
      historyItem1.permitId === historyItem2.permitId
        && historyItem1.revisionDateTime === historyItem2.revisionDateTime
        && historyItem1.name === historyItem2.name
        && historyItem1.comment === historyItem2.comment,
  );

  return {
    initialFormData,
    permitType,
    applicationNumber,
    permitNumber,
    startDate,
    expiryDate,
    currentSelectedLOAs,
    permitConditions,
    vehicleFormData,
    allConditions,
    availableDurationOptions,
    powerUnitSubtypes,
    trailerSubtypes,
    isLcvDesignated,
    ineligiblePowerUnitSubtypes,
    ineligibleTrailerSubtypes,
    filteredVehicleOptions,
    feature,
    companyInfo,
    isAmendAction,
    createdDateTime,
    updatedDateTime,
    pastStartDateStatus,
    companyLOAs: memoizedCompanyLOAs,
    revisionHistory: memoizedRevisionHistory,
    onLeave,
    onSave,
    onCancel,
    onContinue,
    onSetDuration,
    onSetExpiryDate,
    onSetConditions,
    onToggleSaveVehicle,
    onSetVehicle,
    onClearVehicle,
    onUpdateLOAs,
  };
};