import dayjs, { Dayjs } from "dayjs";

import { getUserGuidFromSession } from "../../../common/apiManager/httpRequestHandler";
import { BCeIDUserDetailContext } from "../../../common/authentication/OnRouteBCContext";
import { TROS_COMMODITIES } from "../constants/termOversizeConstants";
import {
  getEndOfDate,
  getStartOfDate,
  now,
} from "../../../common/helpers/formatDate";
import { Nullable } from "../../../common/types/common";
import { PERMIT_STATUSES } from "../types/PermitStatus";
import { calculateFeeByDuration } from "./feeSummary";
import { PERMIT_TYPES } from "../types/PermitType";
import { getExpiryDate } from "./permitState";
import {
  Address,
  CompanyProfile,
} from "../../manageProfile/types/manageProfile";

import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../common/helpers/util";

import {
  Application,
  ContactDetails,
  MailingAddress,
  VehicleDetails,
} from "../types/application";

/**
 * Get default values for contact details, or populate with existing contact details and/or user details
 * @param isNewApplication true if the application has not been created yet, false if created already
 * @param contactDetails existing contact details for the application, if any
 * @param userDetails existing user details, if any
 * @returns default values for contact details
 */
export const getDefaultContactDetails = (
  isNewApplication: boolean,
  contactDetails?: ContactDetails,
  userDetails?: BCeIDUserDetailContext,
) => {
  if (isNewApplication) {
    return {
      firstName: getDefaultRequiredVal("", userDetails?.firstName),
      lastName: getDefaultRequiredVal("", userDetails?.lastName),
      phone1: getDefaultRequiredVal("", userDetails?.phone1),
      phone1Extension: getDefaultRequiredVal("", userDetails?.phone1Extension),
      phone2: getDefaultRequiredVal("", userDetails?.phone2),
      phone2Extension: getDefaultRequiredVal("", userDetails?.phone2Extension),
      email: getDefaultRequiredVal("", userDetails?.email),
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
    email: getDefaultRequiredVal("", contactDetails?.email),
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
  mailingAddress?: MailingAddress,
  alternateAddress?: Address,
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
export const getDefaultVehicleDetails = (vehicleDetails?: VehicleDetails) => ({
  unitNumber: getDefaultRequiredVal("", vehicleDetails?.unitNumber),
  vin: getDefaultRequiredVal("", vehicleDetails?.vin),
  plate: getDefaultRequiredVal("", vehicleDetails?.plate),
  make: getDefaultRequiredVal("", vehicleDetails?.make),
  year: applyWhenNotNullable((year) => year, vehicleDetails?.year, null),
  countryCode: getDefaultRequiredVal("", vehicleDetails?.countryCode),
  provinceCode: getDefaultRequiredVal("", vehicleDetails?.provinceCode),
  vehicleType: getDefaultRequiredVal("", vehicleDetails?.vehicleType),
  vehicleSubType: getDefaultRequiredVal("", vehicleDetails?.vehicleSubType),
  saveVehicle: getDefaultRequiredVal(false, vehicleDetails?.saveVehicle),
});

export const getDurationOrDefault = (
  defaultDuration: number,
  duration?: Nullable<number | string>,
): number => {
  return applyWhenNotNullable(
    (duration) => +duration,
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
 * @param applicationData existing application data, if any
 * @param companyId company id of the current user, if any
 * @param userDetails user details of current user, if any
 * @returns default values for the application data
 */
export const getDefaultValues = (
  applicationData?: Nullable<Application>,
  companyId?: number,
  userDetails?: BCeIDUserDetailContext,
  companyInfo?: CompanyProfile,
) => {
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
    userGuid: getDefaultRequiredVal(
      "",
      applicationData?.userGuid,
      getUserGuidFromSession(),
    ),
    permitId: getDefaultRequiredVal("", applicationData?.permitId),
    permitNumber: getDefaultRequiredVal("", applicationData?.permitNumber),
    permitType: getDefaultRequiredVal(
      PERMIT_TYPES.TROS,
      applicationData?.permitType,
    ),
    permitStatus: getDefaultRequiredVal(
      PERMIT_STATUSES.IN_PROGRESS,
      applicationData?.permitStatus,
    ),
    createdDateTime: applyWhenNotNullable(
      (date) => dayjs(date),
      applicationData?.createdDateTime,
      now(),
    ),
    updatedDateTime: applyWhenNotNullable(
      (date) => dayjs(date),
      applicationData?.updatedDateTime,
      now(),
    ),
    revision: getDefaultRequiredVal(0, applicationData?.revision),
    previousRevision: getDefaultRequiredVal(
      "",
      applicationData?.previousRevision,
    ),
    documentId: getDefaultRequiredVal("", applicationData?.documentId),
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
        [TROS_COMMODITIES[0], TROS_COMMODITIES[1]],
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
      ),
      // Default values are updated from companyInfo query in the ContactDetails common component
      mailingAddress: getDefaultMailingAddress(
        applicationData?.permitData?.mailingAddress,
        companyInfo?.mailingAddress,
      ),
      vehicleDetails: getDefaultVehicleDetails(
        applicationData?.permitData?.vehicleDetails,
      ),
      feeSummary: getDefaultRequiredVal(
        `${calculateFeeByDuration(durationOrDefault)}`,
        applicationData?.permitData?.feeSummary,
      ),
    },
  };
};
