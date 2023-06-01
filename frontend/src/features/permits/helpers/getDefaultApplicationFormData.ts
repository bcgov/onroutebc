import dayjs from "dayjs";

import { getUserGuidFromSession } from "../../../common/apiManager/httpRequestHandler";
import { UserDetailContext } from "../../../common/authentication/OnRouteBCContext";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../common/helpers/util";
import { Application, ContactDetails, MailingAddress, VehicleDetails } from "../types/application";
import { TROS_COMMODITIES } from "../constants/termOversizeConstants";
import { now } from "../../../common/helpers/formatDate";
import { Address } from "../../manageProfile/types/manageProfile";

export const getDefaultContactDetails = (contactDetails?: ContactDetails, userDetails?: UserDetailContext) => ({
  firstName: getDefaultRequiredVal(
    "",
    contactDetails?.firstName,
    userDetails?.firstName
  ),
  lastName: getDefaultRequiredVal(
    "",
    contactDetails?.lastName,
    userDetails?.lastName
  ),
  phone1: getDefaultRequiredVal(
    "",
    contactDetails?.phone1,
    userDetails?.phone1
  ),
  phone1Extension: getDefaultRequiredVal(
    "",
    contactDetails?.phone1Extension
  ),
  phone2: getDefaultRequiredVal(
    "",
    contactDetails?.phone2
  ),
  phone2Extension: getDefaultRequiredVal(
    "",
    contactDetails?.phone2Extension
  ),
  email: getDefaultRequiredVal(
    "",
    contactDetails?.email,
    userDetails?.email
  ),
  fax: getDefaultRequiredVal(
    "",
    contactDetails?.fax
  ),
});

export const getDefaultMailingAddress = (mailingAddress?: MailingAddress, alternateAddress?: Address) => 
  mailingAddress ? ({
    addressLine1: getDefaultRequiredVal(
      "",
      mailingAddress?.addressLine1
    ),
    addressLine2: getDefaultRequiredVal(
      "",
      mailingAddress?.addressLine2
    ),
    city: getDefaultRequiredVal(
      "",
      mailingAddress?.city
    ),
    provinceCode: getDefaultRequiredVal(
      "",
      mailingAddress?.provinceCode
    ),
    countryCode: getDefaultRequiredVal(
      "",
      mailingAddress?.countryCode
    ),
    postalCode: getDefaultRequiredVal(
      "",
      mailingAddress?.postalCode
    ),
  }) : ({
    addressLine1: getDefaultRequiredVal(
      "",
      alternateAddress?.addressLine1
    ),
    addressLine2: getDefaultRequiredVal(
      "",
      alternateAddress?.addressLine2
    ),
    city: getDefaultRequiredVal(
      "",
      alternateAddress?.city
    ),
    provinceCode: getDefaultRequiredVal(
      "",
      alternateAddress?.provinceCode
    ),
    countryCode: getDefaultRequiredVal(
      "",
      alternateAddress?.countryCode
    ),
    postalCode: getDefaultRequiredVal(
      "",
      alternateAddress?.postalCode
    ),
  });

export const getDefaultVehicleDetails = (vehicleDetails?: VehicleDetails) => ({
  unitNumber: getDefaultRequiredVal(
    "",
    vehicleDetails?.unitNumber
  ),
  vin: getDefaultRequiredVal(
    "",
    vehicleDetails?.vin
  ),
  plate: getDefaultRequiredVal(
    "",
    vehicleDetails?.plate
  ),
  make: getDefaultRequiredVal(
    "",
    vehicleDetails?.make
  ),
  year: applyWhenNotNullable(
    (year) => year,
    vehicleDetails?.year,
    null
  ),
  countryCode: getDefaultRequiredVal(
    "",
    vehicleDetails?.countryCode
  ),
  provinceCode: getDefaultRequiredVal(
    "",
    vehicleDetails?.provinceCode
  ),
  vehicleType: getDefaultRequiredVal(
    "",
    vehicleDetails?.vehicleType
  ),
  vehicleSubType: getDefaultRequiredVal(
    "",
    vehicleDetails?.vehicleSubType
  ),
  saveVehicle: getDefaultRequiredVal(
    false,
    vehicleDetails?.saveVehicle
  ),
});

export const getDefaultValues = (applicationData?: Application, companyId?: number, userDetails?: UserDetailContext) => ({
  companyId: +getDefaultRequiredVal(0, companyId),
  applicationNumber: getDefaultRequiredVal(
    "",
    applicationData?.applicationNumber
  ),
  userGuid: getUserGuidFromSession(),
  permitType: getDefaultRequiredVal(
    "TROS",
    applicationData?.permitType
  ),
  permitStatus: getDefaultRequiredVal(
    "IN_PROGRESS",
    applicationData?.permitStatus
  ),
  createdDateTime: applyWhenNotNullable(
    (date) => dayjs(date),
    applicationData?.createdDateTime,
    now()
  ),
  updatedDateTime: applyWhenNotNullable(
    (date) => dayjs(date),
    applicationData?.updatedDateTime,
    now()
  ),
  permitData: {
    startDate: applyWhenNotNullable(
      (date) => dayjs(date),
      applicationData?.permitData?.startDate,
      now()
    ),
    permitDuration: applyWhenNotNullable(
      (duration) => +duration,
      applicationData?.permitData?.permitDuration,
      30
    ),
    expiryDate: applyWhenNotNullable(
      (date) => dayjs(date),
      applicationData?.permitData?.expiryDate,
      now()
    ),
    commodities: getDefaultRequiredVal(
      [TROS_COMMODITIES[0], TROS_COMMODITIES[1]],
      applicationData?.permitData?.commodities
    ),
    contactDetails: getDefaultContactDetails(applicationData?.permitData?.contactDetails, userDetails),
    // Default values are updated from companyInfo query in the ContactDetails common component
    mailingAddress: getDefaultMailingAddress(applicationData?.permitData?.mailingAddress),
    vehicleDetails: getDefaultVehicleDetails(applicationData?.permitData?.vehicleDetails),
  },
});
