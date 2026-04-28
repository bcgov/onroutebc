import dayjs, { Dayjs } from "dayjs";

import { BCeIDUserDetailContext } from "../../../common/authentication/OnRouteBCContext";
import { getMandatoryConditions } from "./conditions";
import { Nullable } from "../../../common/types/common";
import { PERMIT_STATUSES } from "../types/PermitStatus";
import {
  isQuarterlyPermit,
  PERMIT_TYPES,
  PermitType,
} from "../types/PermitType";
import {
  isQuarterlyPermit,
  PERMIT_TYPES,
  PermitType,
} from "../types/PermitType";
import { getExpiryDate } from "./permitState";
import { PermitMailingAddress } from "../types/PermitMailingAddress";
import { PermitContactDetails } from "../types/PermitContactDetails";
import { Application, ApplicationFormData } from "../types/application";
import { minDurationForPermitType } from "./dateSelection";
import { getDefaultVehicleDetails } from "./vehicles/getDefaultVehicleDetails";
import { getDefaultPermittedRoute } from "./route/getDefaultPermittedRoute";
import { getDefaultPermittedCommodity } from "./permittedCommodity";
import { DEFAULT_THIRD_PARTY_LIABILITY } from "../types/ThirdPartyLiability";
import { DEFAULT_CONDITIONAL_LICENSING_FEE_TYPE } from "../types/ConditionalLicensingFee";
import { getDefaultVehicleConfiguration } from "./vehicles/configuration/getDefaultVehicleConfiguration";
import { getDefaultVehicleConfiguration } from "./vehicles/configuration/getDefaultVehicleConfiguration";

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
  isQuarterly: boolean,
  durationOrDefault: number,
  expiryDate?: Nullable<Dayjs | string>,
): Dayjs => {
  return applyWhenNotNullable(
    (date) => getEndOfDate(dayjs(date)),
    expiryDate,
    getExpiryDate(startDateOrDefault, isQuarterly, durationOrDefault),
  );
};

/**
 * Gets default values for the application data, or populate with values from existing application and relevant data.
 * @param permitType Permit type for the application
 * @param companyInfo Company profile information (can be undefined, but must be passed as param)
 * @param applicationData Existing application data, if already exists
 * @param userDetails User details of current user, if any
 * @param shouldInitAsCopy Whether or not getting the application data is part of a copying operation
 * @returns Default values for the application data
 */
export const getDefaultValues = (
  permitType: PermitType,
  companyInfo: Nullable<CompanyProfile>,
  applicationData?: Nullable<Application | ApplicationFormData>,
  userDetails?: Nullable<BCeIDUserDetailContext>,
  shouldInitAsCopy: boolean = false,
): ApplicationFormData => {
  const defaultPermitType = getDefaultRequiredVal(
    permitType,
    applicationData?.permitType,
  );

  const defaultPermitId = !shouldInitAsCopy
    ? getDefaultRequiredVal("", applicationData?.permitId)
    : "";

  const defaultOriginalPermitId = !shouldInitAsCopy
    ? getDefaultRequiredVal("", applicationData?.originalPermitId)
    : "";

  const defaultApplicationNumber = !shouldInitAsCopy
    ? getDefaultRequiredVal("", applicationData?.applicationNumber)
    : "";

  const defaultPermitNumber = !shouldInitAsCopy
    ? getDefaultRequiredVal("", applicationData?.permitNumber)
    : "";

  const defaultCompanyName = getDefaultRequiredVal(
    "",
    !shouldInitAsCopy
      ? applicationData?.permitData?.companyName
      : companyInfo?.legalName,
    companyInfo?.legalName,
  );

  const defaultClientNumber = getDefaultRequiredVal(
    "",
    !shouldInitAsCopy
      ? applicationData?.permitData?.clientNumber
      : companyInfo?.clientNumber,
    companyInfo?.clientNumber,
  );

  const startDateOrDefault = getStartDateOrDefault(
    now(),
    !shouldInitAsCopy ? applicationData?.permitData?.startDate : now(),
  );

  const durationOrDefault = getDurationOrDefault(
    minDurationForPermitType(permitType),
    applicationData?.permitData?.permitDuration,
  );

  const expiryDateOrDefault = getExpiryDateOrDefault(
    startDateOrDefault,
    isQuarterlyPermit(permitType),
    durationOrDefault,
    !shouldInitAsCopy ? applicationData?.permitData?.expiryDate : undefined, // let expiry be automatically calculated/derived for initializing copied permits
  );

  const defaultConditions = getDefaultRequiredVal(
    getMandatoryConditions(permitType),
    applyWhenNotNullable(
      (conditions) => conditions.map((condition) => ({ ...condition })),
      applicationData?.permitData?.commodities,
    ),
  );

  const defaultPermittedRoute = getDefaultPermittedRoute(
    permitType,
    applicationData?.permitData?.permittedRoute,
  );

  return {
    permitType: defaultPermitType,
    permitId: defaultPermitId,
    originalPermitId: defaultOriginalPermitId,
    applicationNumber: defaultApplicationNumber,
    permitNumber: defaultPermitNumber,
    permitStatus: !shouldInitAsCopy
      ? getDefaultRequiredVal(
          PERMIT_STATUSES.IN_PROGRESS,
          applicationData?.permitStatus,
        )
      : PERMIT_STATUSES.IN_PROGRESS,
    permitData: {
      companyName: defaultCompanyName,
      doingBusinessAs: getDefaultRequiredVal(
        "",
        companyInfo?.alternateName, // always use the latest DBA fetched from company info
      ),
      clientNumber: defaultClientNumber,
      contactDetails: getDefaultContactDetails(
        defaultApplicationNumber.trim() === "" || shouldInitAsCopy,
        applicationData?.permitData?.contactDetails,
        userDetails,
        companyInfo?.email,
      ),
      // Default values are updated from companyInfo query in the ContactDetails common component
      mailingAddress: getDefaultMailingAddress(
        !shouldInitAsCopy
          ? applicationData?.permitData?.mailingAddress
          : companyInfo?.mailingAddress,
        companyInfo?.mailingAddress,
      ),
      startDate: startDateOrDefault,
      permitDuration: durationOrDefault,
      expiryDate: expiryDateOrDefault,
      commodities: defaultConditions,
      vehicleDetails: getDefaultVehicleDetails(
        applicationData?.permitData?.vehicleDetails,
      ),
      feeSummary: "", // not used, as actual fee is derived at the given locations when required
      loas: getDefaultRequiredVal([], applicationData?.permitData?.loas),
      permittedRoute: defaultPermittedRoute,
      applicationNotes:
        permitType !== PERMIT_TYPES.STOS && permitType !== PERMIT_TYPES.STOW
          ? null
          : getDefaultRequiredVal(
              "",
              applicationData?.permitData?.applicationNotes,
            ),
      permittedCommodity: getDefaultPermittedCommodity(
        permitType,
        applicationData?.permitData?.permittedCommodity,
      ),
      vehicleConfiguration: getDefaultVehicleConfiguration(
        permitType,
        applicationData?.permitData?.vehicleConfiguration,
      ),
      thirdPartyLiability: (
        [PERMIT_TYPES.STFR, PERMIT_TYPES.QRFR] as PermitType[]
      ).includes(permitType)
      thirdPartyLiability: (
        [PERMIT_TYPES.STFR, PERMIT_TYPES.QRFR] as PermitType[]
      ).includes(permitType)
        ? getDefaultRequiredVal(
            DEFAULT_THIRD_PARTY_LIABILITY,
            applicationData?.permitData?.thirdPartyLiability,
          )
            DEFAULT_THIRD_PARTY_LIABILITY,
            applicationData?.permitData?.thirdPartyLiability,
          )
        : null,
      conditionalLicensingFee: (
        [PERMIT_TYPES.NRSCV, PERMIT_TYPES.NRQCV] as PermitType[]
      ).includes(permitType)
      conditionalLicensingFee: (
        [PERMIT_TYPES.NRSCV, PERMIT_TYPES.NRQCV] as PermitType[]
      ).includes(permitType)
        ? getDefaultRequiredVal(
            DEFAULT_CONDITIONAL_LICENSING_FEE_TYPE,
            applicationData?.permitData?.conditionalLicensingFee,
          )
        : null,
            DEFAULT_CONDITIONAL_LICENSING_FEE_TYPE,
            applicationData?.permitData?.conditionalLicensingFee,
          )
        : null,
    },
    comment: getDefaultRequiredVal("", applicationData?.comment),
  };
};
