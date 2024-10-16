import { Nullable } from "../../../common/types/common";
import { isVehicleSubtypeLCV } from "../../manageVehicles/helpers/vehicleSubtypes";
import { LCV_CONDITION } from "../constants/constants";
import { Application, ApplicationFormData } from "../types/application";
import { PermitCondition } from "../types/PermitCondition";
import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { sortConditions } from "./conditions";
import { getDefaultVehicleDetails } from "./permitVehicles";

/**
 * Get updated vehicle details based on LCV designation.
 * @param isLcvDesignated Whether or not the LCV designation is to be used
 * @param prevSelectedVehicle Previous selected vehicle details
 * @returns Updated vehicle details
 */
export const getUpdatedVehicleDetailsForLCV = (
  isLcvDesignated: boolean,
  prevSelectedVehicle: PermitVehicleDetails,
) => {
  if (!isLcvDesignated && isVehicleSubtypeLCV(prevSelectedVehicle.vehicleSubType)) {
    // If LCV isn't designated, and selected vehicle has LCV subtype, clear the vehicle
    return getDefaultVehicleDetails();
  }

  // Otherwise keep the existing vehicle details
  return prevSelectedVehicle;
};

/**
 * Get updated permit conditions based on LCV designation and selected vehicle subtype.
 * @param isLcvDesignated Whether or not the LCV designation is to be used
 * @param prevSelectedConditions Previously selected permit conditions
 * @param vehicleSubtype Selected vehicle subtype
 * @returns Updated permit conditions
 */
export const getUpdatedConditionsForLCV = (
  isLcvDesignated: boolean,
  prevSelectedConditions: PermitCondition[],
  vehicleSubtype: string,
) => {
  if (!isLcvDesignated) {
    // If LCV not designated, remove LCV condition
    return prevSelectedConditions.filter(
      ({ condition }: PermitCondition) => condition !== LCV_CONDITION.condition,
    );
  }
  
  // If LCV is designated, and vehicle subtype isn't LCV but conditions have LCV,
  // then remove that LCV condition
  if (
    !isVehicleSubtypeLCV(vehicleSubtype)
    && prevSelectedConditions.some(({ condition }) => condition === LCV_CONDITION.condition)
  ) {
    return prevSelectedConditions.filter(
      ({ condition }: PermitCondition) => condition !== LCV_CONDITION.condition,
    );
  }

  // If LCV is designated, and vehicle subtype is LCV but conditions don't have LCV,
  // then add that LCV condition
  if (
    isVehicleSubtypeLCV(vehicleSubtype)
    && !prevSelectedConditions.some(({ condition }) => condition === LCV_CONDITION.condition)
  ) {
    return sortConditions([...prevSelectedConditions, LCV_CONDITION]);
  }

  // In other cases, the conditions are valid
  return prevSelectedConditions;
};

/**
 * Applying LCV designation to application data.
 * @param applicationData Existing application data
 * @param isLcvDesignated Whether or not the LCV designation is to be used
 * @returns Application data after applying the LCV check
 */
export const applyLCVToApplicationData = <T extends Nullable<ApplicationFormData | Application>>(
  applicationData: T,
  isLcvDesignated: boolean,
): T => {
  // If application doesn't exist, no need to apply LCV at all
  if (!applicationData) return applicationData;

  const updatedVehicleDetails = getUpdatedVehicleDetailsForLCV(
    isLcvDesignated,
    applicationData.permitData.vehicleDetails,
  );

  const updatedConditions = getUpdatedConditionsForLCV(
    isLcvDesignated,
    applicationData.permitData.commodities,
    updatedVehicleDetails.vehicleSubType,
  );

  return {
    ...applicationData,
    permitData: {
      ...applicationData.permitData,
      commodities: [...updatedConditions],
      vehicleDetails: updatedVehicleDetails,
    },
  };
};
