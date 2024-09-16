import dayjs, { Dayjs } from "dayjs";

import { BCeIDUserDetailContext } from "../../../common/authentication/OnRouteBCContext";
import { getMandatoryConditions, sortConditions } from "./conditions";
import { Nullable } from "../../../common/types/common";
import { PERMIT_STATUSES } from "../types/PermitStatus";
import { calculateFeeByDuration } from "./feeSummary";
import { PermitType } from "../types/PermitType";
import { getExpiryDate } from "./permitState";
import { PermitMailingAddress } from "../types/PermitMailingAddress";
import { PermitContactDetails } from "../types/PermitContactDetails";
import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { Application, ApplicationFormData } from "../types/application";
import { minDurationForPermitType } from "./dateSelection";
import { PermitCondition } from "../types/PermitCondition";
import { LCV_CONDITION } from "../constants/constants";
import { isVehicleSubtypeLCV } from "../../manageVehicles/helpers/vehicleSubtypes";
import {
  getEndOfDate,
  getStartOfDate,
  now,
} from "../../../common/helpers/formatDate";

import {
  Address,
  CompanyProfile,
} from "../../manageProfile/types/manageProfile";

import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../common/helpers/util";

/**
 * Get default values for contact details, or populate with existing contact details and/or user details
 * @param isNewApplication true if the application has not been created yet, false if created already
 * @param contactDetails existing contact details for the application, if any
 * @param userDetails existing user details, if any
 * @param companyEmail company email
 * @returns default values for contact details
 */
export const getDefaultContactDetails = (
  isNewApplication: boolean,
  contactDetails?: Nullable<PermitContactDetails>,
  userDetails?: Nullable<BCeIDUserDetailContext>,
  companyEmail?: Nullable<string>,
) => {
  if (isNewApplication) {
    return {
      firstName: getDefaultRequiredVal("", userDetails?.firstName),
      lastName: getDefaultRequiredVal("", userDetails?.lastName),
      phone1: getDefaultRequiredVal("", userDetails?.phone1),
      phone1Extension: getDefaultRequiredVal("", userDetails?.phone1Extension),
      phone2: getDefaultRequiredVal("", userDetails?.phone2),
      phone2Extension: getDefaultRequiredVal("", userDetails?.phone2Extension),
      email: getDefaultRequiredVal("", companyEmail),
      additionalEmail: getDefaultRequiredVal("", userDetails?.email),
      fax: getDefaultRequiredVal("", userDetails?.fax),
    };
  }

  return {
    firstName: getDefaultRequiredVal("", contactDetails?.firstName),
    lastName: getDefaultRequiredVal("", contactDetails?.lastName),
    phone1: getDefaultRequiredVal("", contactDetails?.phone1),
    phone1Extension: getDefaultRequiredVal("", contactDetails?.phone1Extension),
    phone2: getDefaultRequiredVal("", contactDetails?.phone2),
    phone2Extension: getDefaultRequiredVal("", contactDetails?.phone2Extension),
    email: getDefaultRequiredVal("", contactDetails?.email, companyEmail),
    additionalEmail: getDefaultRequiredVal("", contactDetails?.additionalEmail),
    fax: getDefaultRequiredVal("", contactDetails?.fax),
  };
};

/**
 * Get default values for mailing address, or populate with values from existing mailing address and/or alternate address.
 * @param mailingAddress existing mailing address, if any
 * @param alternateAddress existing alternative address, if any
 * @returns default values for mailing address
 */
export const getDefaultMailingAddress = (
  mailingAddress?: Nullable<PermitMailingAddress>,
  alternateAddress?: Nullable<Address>,
) =>
  mailingAddress
    ? {
        addressLine1: getDefaultRequiredVal("", mailingAddress?.addressLine1),
        addressLine2: getDefaultRequiredVal("", mailingAddress?.addressLine2),
        city: getDefaultRequiredVal("", mailingAddress?.city),
        provinceCode: getDefaultRequiredVal("", mailingAddress?.provinceCode),
        countryCode: getDefaultRequiredVal("", mailingAddress?.countryCode),
        postalCode: getDefaultRequiredVal("", mailingAddress?.postalCode),
      }
    : {
        addressLine1: getDefaultRequiredVal("", alternateAddress?.addressLine1),
        addressLine2: getDefaultRequiredVal("", alternateAddress?.addressLine2),
        city: getDefaultRequiredVal("", alternateAddress?.city),
        provinceCode: getDefaultRequiredVal("", alternateAddress?.provinceCode),
        countryCode: getDefaultRequiredVal("", alternateAddress?.countryCode),
        postalCode: getDefaultRequiredVal("", alternateAddress?.postalCode),
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
  vehicleType: getDefaultRequiredVal("", vehicleDetails?.vehicleType),
  vehicleSubType: getDefaultRequiredVal("", vehicleDetails?.vehicleSubType),
  saveVehicle: false,
});

export const getDurationOrDefault = (
  defaultDuration: number,
  duration?: Nullable<number | string>,
): number => {
  return applyWhenNotNullable(
    (duration: string | number) => +duration,
    duration,
    defaultDuration,
  );
};

export const getStartDateOrDefault = (
  defaultStartDate: Dayjs,
  startDate?: Nullable<Dayjs | string>,
): Dayjs => {
  return applyWhenNotNullable(
    (date) => getStartOfDate(dayjs(date)),
    startDate,
    getStartOfDate(defaultStartDate),
  );
};

export const getExpiryDateOrDefault = (
  startDateOrDefault: Dayjs,
  durationOrDefault: number,
  expiryDate?: Nullable<Dayjs | string>,
): Dayjs => {
  return applyWhenNotNullable(
    (date) => getEndOfDate(dayjs(date)),
    expiryDate,
    getExpiryDate(startDateOrDefault, durationOrDefault),
  );
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

  if (!isLcvDesignated) {
    // If LCV not designated, remove LCV condition from application data
    const filteredConditions = applicationData.permitData.commodities.filter(
      ({ condition }: PermitCondition) => condition !== LCV_CONDITION.condition,
    );

    if (isVehicleSubtypeLCV(applicationData.permitData.vehicleDetails.vehicleSubType)) {
      // Furthermore, if selected vehicle has LCV subtype, clear the vehicle
      return {
        ...applicationData,
        permitData: {
          ...applicationData.permitData,
          commodities: [...filteredConditions],
          vehicleDetails: getDefaultVehicleDetails(),
        },
      };
    }

    // Otherwise, keep the existing vehicle
    return {
      ...applicationData,
      permitData: {
        ...applicationData.permitData,
        commodities: [...filteredConditions],
      },
    };
  }
  
  // If LCV is designated, and vehicle subtype in the application isn't LCV but conditions have LCV,
  // then remove that LCV condition from the application
  if (
    !isVehicleSubtypeLCV(applicationData.permitData.vehicleDetails.vehicleSubType)
    && applicationData.permitData.commodities.some(({ condition }) => condition === LCV_CONDITION.condition)
  ) {
    const filteredConditions = applicationData.permitData.commodities.filter(
      ({ condition }: PermitCondition) => condition !== LCV_CONDITION.condition,
    );

    return {
      ...applicationData,
      permitData: {
        ...applicationData.permitData,
        commodities: [...filteredConditions],
      },
    };
  }

  // If LCV is designated, and vehicle subtype in the application is LCV but conditions don't have LCV,
  // then add that LCV condition into the application
  if (
    isVehicleSubtypeLCV(applicationData.permitData.vehicleDetails.vehicleSubType)
    && !applicationData.permitData.commodities.some(({ condition }) => condition === LCV_CONDITION.condition)
  ) {
    const conditionsWithLCV = sortConditions([...applicationData.permitData.commodities, LCV_CONDITION]);

    return {
      ...applicationData,
      permitData: {
        ...applicationData.permitData,
        commodities: [...conditionsWithLCV],
      },
    };
  }

  // In other cases, the application data is valid
  return applicationData;
};

/**
 * Gets default values for the application data, or populate with values from existing application and relevant data.
 * @param permitType permit type for the application
 * @param companyInfo data from company profile information (can be undefined, but must be passed as param)
 * @param applicationData existing application data, if any
 * @param userDetails user details of current user, if any
 * @returns default values for the application data
 */
export const getDefaultValues = (
  permitType: PermitType,
  companyInfo: Nullable<CompanyProfile>,
  applicationData?: Nullable<Application | ApplicationFormData>,
  userDetails?: Nullable<BCeIDUserDetailContext>,
): ApplicationFormData => {
  const startDateOrDefault = getStartDateOrDefault(
    now(),
    applicationData?.permitData?.startDate,
  );

  const durationOrDefault = getDurationOrDefault(
    minDurationForPermitType(permitType),
    applicationData?.permitData?.permitDuration,
  );

  const expiryDateOrDefault = getExpiryDateOrDefault(
    startDateOrDefault,
    durationOrDefault,
    applicationData?.permitData?.expiryDate,
  );

  const defaultPermitType = getDefaultRequiredVal(
    permitType,
    applicationData?.permitType,
  );

  return {
    originalPermitId: getDefaultRequiredVal(
      "",
      applicationData?.originalPermitId,
    ),
    comment: getDefaultRequiredVal("", applicationData?.comment),
    applicationNumber: getDefaultRequiredVal(
      "",
      applicationData?.applicationNumber,
    ),
    permitId: getDefaultRequiredVal("", applicationData?.permitId),
    permitNumber: getDefaultRequiredVal("", applicationData?.permitNumber),
    permitType: defaultPermitType,
    permitStatus: getDefaultRequiredVal(
      PERMIT_STATUSES.IN_PROGRESS,
      applicationData?.permitStatus,
    ),
    permitData: {
      companyName: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.companyName,
        companyInfo?.legalName,
      ),
      doingBusinessAs: getDefaultRequiredVal(
        "",
        companyInfo?.alternateName, // always use the latest DBA fetched from company info
      ),
      clientNumber: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.clientNumber,
        companyInfo?.clientNumber,
      ),
      startDate: startDateOrDefault,
      permitDuration: durationOrDefault,
      expiryDate: expiryDateOrDefault,
      commodities: getDefaultRequiredVal(
        getMandatoryConditions(permitType),
        applyWhenNotNullable(
          (conditions) => conditions.map((condition) => ({ ...condition })),
          applicationData?.permitData?.commodities,
        ),
      ),
      contactDetails: getDefaultContactDetails(
        getDefaultRequiredVal("", applicationData?.applicationNumber).trim() ===
          "",
        applicationData?.permitData?.contactDetails,
        userDetails,
        companyInfo?.email,
      ),
      // Default values are updated from companyInfo query in the ContactDetails common component
      mailingAddress: getDefaultMailingAddress(
        applicationData?.permitData?.mailingAddress,
        companyInfo?.mailingAddress,
      ),
      vehicleDetails: getDefaultVehicleDetails(
        applicationData?.permitData?.vehicleDetails,
      ),
      feeSummary: `${calculateFeeByDuration(defaultPermitType, durationOrDefault)}`,
      selectedLoas: getDefaultRequiredVal([], applicationData?.permitData?.selectedLoas),
    },
  };
};
