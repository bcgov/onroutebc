import { useContext } from "react";

import { ApplicationFormContext } from "../context/ApplicationFormContext";
import { usePermitDateSelection } from "./usePermitDateSelection";
import { LOADetail } from "../../settings/types/SpecialAuthorization";
import { usePermitConditions } from "./usePermitConditions";
import { getStartOfDate } from "../../../common/helpers/formatDate";
import { getIneligibleSubtypes } from "../helpers/permitVehicles";
import { usePermitVehicleForLOAs } from "./usePermitVehicleForLOAs";

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

  const permitType = formData.permitType;
  const {
    loas: currentSelectedLOAs,
    permitDuration,
    startDate: permitStartDate,
    commodities: permitConditions,
    vehicleDetails: vehicleFormData,
  } = formData.permitData;

  // Update duration options and expiry when needed
  const { availableDurationOptions } = usePermitDateSelection(
    permitType,
    getStartOfDate(permitStartDate),
    durationOptions,
    currentSelectedLOAs as LOADetail[],
    permitDuration,
    onSetDuration,
    onSetExpiryDate,
  );
  
  // Update permit conditions when LCV designation or vehicle subtype changes
  usePermitConditions(
    permitConditions,
    isLcvDesignated,
    vehicleFormData.vehicleSubType,
    onSetConditions,
  );

  // Check to see if vehicle details is still valid after LOA has been deselected
  const {
    ineligiblePowerUnitSubtypes,
    ineligibleTrailerSubtypes,
  } = getIneligibleSubtypes(permitType, isLcvDesignated);

  const { filteredVehicleOptions } = usePermitVehicleForLOAs(
    vehicleFormData,
    vehicleOptions,
    currentSelectedLOAs as LOADetail[],
    ineligiblePowerUnitSubtypes.map(({ typeCode }) => typeCode),
    ineligibleTrailerSubtypes.map(({ typeCode }) => typeCode),
    () => onClearVehicle(Boolean(vehicleFormData.saveVehicle)),
  );

  return {
    initialFormData,
    formData,
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
  };
};