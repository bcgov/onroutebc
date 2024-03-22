import dayjs, { Dayjs } from "dayjs";

import { BCeIDUserDetailContext } from "../../../common/authentication/OnRouteBCContext";
import { getMandatoryCommodities } from "./commodities";
import { Nullable } from "../../../common/types/common";
import { PERMIT_STATUSES } from "../types/PermitStatus";
import { calculateFeeByDuration } from "./feeSummary";
import { PermitType } from "../types/PermitType";
import { getExpiryDate } from "./permitState";
import { PermitMailingAddress } from "../types/PermitMailingAddress";
import { PermitContactDetails } from "../types/PermitContactDetails";
import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { Application, ApplicationFormData } from "../types/application";
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
 * Gets default values for the application data, or populate with values from existing application data and company id/user details.
 * @param permitType permit type for the application
 * @param applicationData existing application data, if any
 * @param companyId company id of the current user, if any
 * @param userDetails user details of current user, if any
 * @param companyInfo data from company profile information
 * @returns default values for the application data
 */
export const getDefaultValues = (
  permitType: PermitType,
  applicationData?: Nullable<Application | ApplicationFormData>,
  companyId?: Nullable<number>,
  userDetails?: Nullable<BCeIDUserDetailContext>,
  companyInfo?: Nullable<CompanyProfile>,
): ApplicationFormData => {
  const startDateOrDefault = getStartDateOrDefault(
    now(),
    applicationData?.permitData?.startDate,
  );

  const durationOrDefault = getDurationOrDefault(
    30,
    applicationData?.permitData?.permitDuration,
  );

  const expiryDateOrDefault = getExpiryDateOrDefault(
    startDateOrDefault,
    durationOrDefault,
    applicationData?.permitData?.expiryDate,
  );

  return {
    companyId: +getDefaultRequiredVal(0, companyId),
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
    permitType: getDefaultRequiredVal(permitType, applicationData?.permitType),
    permitStatus: getDefaultRequiredVal(
      PERMIT_STATUSES.IN_PROGRESS,
      applicationData?.permitStatus,
    ),
    permitData: {
      companyName: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.companyName,
      ),
      clientNumber: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.clientNumber,
      ),
      startDate: startDateOrDefault,
      permitDuration: durationOrDefault,
      expiryDate: expiryDateOrDefault,
      commodities: getDefaultRequiredVal(
        getMandatoryCommodities(permitType),
        applyWhenNotNullable(
          (commodities) => commodities.map((commodity) => ({ ...commodity })),
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
      feeSummary: `${calculateFeeByDuration(durationOrDefault)}`,
    },
  };
};
