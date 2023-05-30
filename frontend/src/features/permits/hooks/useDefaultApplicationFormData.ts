import { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";

import { Application } from "../types/application";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../common/helpers/util";
import { getUserGuidFromSession } from "../../../common/apiManager/httpRequestHandler";
import { now } from "../../../common/helpers/formatDate";
import { TROS_COMMODITIES } from "../constants/termOversizeConstants";
import OnRouteBCContext, { UserDetailContext } from "../../../common/authentication/OnRouteBCContext"; 

const getDefaultValues = (applicationData?: Application, companyId?: number, userDetails?: UserDetailContext) => ({
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
    contactDetails: {
      firstName: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.contactDetails
          ?.firstName,
        userDetails?.firstName
      ),
      lastName: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.contactDetails
          ?.lastName,
        userDetails?.lastName
      ),
      phone1: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.contactDetails
          ?.phone1,
        userDetails?.phone1
      ),
      phone1Extension: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.contactDetails
          ?.phone1Extension
      ),
      phone2: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.contactDetails
          ?.phone2
      ),
      phone2Extension: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.contactDetails
          ?.phone2Extension
      ),
      email: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.contactDetails
          ?.email,
        userDetails?.email
      ),
      fax: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.contactDetails
          ?.fax
      ),
    },
    // Default values are updated from companyInfo query in the ContactDetails common component
    mailingAddress: {
      addressLine1: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.mailingAddress?.addressLine1
      ),
      addressLine2: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.mailingAddress?.addressLine2
      ),
      city: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.mailingAddress?.city
      ),
      provinceCode: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.mailingAddress?.provinceCode
      ),
      countryCode: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.mailingAddress?.countryCode
      ),
      postalCode: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.mailingAddress?.postalCode
      ),
    },
    vehicleDetails: {
      unitNumber: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.vehicleDetails?.unitNumber
      ),
      vin: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.vehicleDetails?.vin
      ),
      plate: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.vehicleDetails?.plate
      ),
      make: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.vehicleDetails?.make
      ),
      year: applyWhenNotNullable(
        (year) => year,
        applicationData?.permitData?.vehicleDetails?.year,
        null
      ),
      countryCode: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.vehicleDetails
          ?.countryCode
      ),
      provinceCode: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.vehicleDetails
          ?.provinceCode
      ),
      vehicleType: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.vehicleDetails
          ?.vehicleType
      ),
      vehicleSubType: getDefaultRequiredVal(
        "",
        applicationData?.permitData?.vehicleDetails
          ?.vehicleSubType
      ),
      saveVehicle: getDefaultRequiredVal(
        false,
        applicationData?.permitData?.vehicleDetails
          ?.saveVehicle
      ),
    },
  },
});

export const useDefaultApplicationFormData = (applicationData?: Application) => {
  const { companyId, userDetails } = useContext(OnRouteBCContext);

  const [defaultApplicationDataValues, setDefaultApplicationDataValues] = useState<Application>(
    getDefaultValues(applicationData, companyId, userDetails)
  );

  useEffect(() => {
    setDefaultApplicationDataValues(
      getDefaultValues(applicationData, companyId, userDetails)
    );
  }, [
    companyId,
    applicationData?.applicationNumber,
    applicationData?.permitStatus,
    applicationData?.permitType,
    applicationData?.createdDateTime,
    applicationData?.updatedDateTime,
    applicationData?.permitData?.startDate,
    applicationData?.permitData?.permitDuration,
    applicationData?.permitData?.expiryDate,
    applicationData?.permitData?.contactDetails?.firstName,
    userDetails?.firstName,
    applicationData?.permitData?.contactDetails?.lastName,
    userDetails?.lastName,
    applicationData?.permitData?.contactDetails?.phone1,
    userDetails?.phone1,
    applicationData?.permitData?.contactDetails?.phone1Extension,
    applicationData?.permitData?.contactDetails?.phone2,
    applicationData?.permitData?.contactDetails?.phone2Extension,
    applicationData?.permitData?.contactDetails?.email,
    userDetails?.email,
    applicationData?.permitData?.contactDetails?.fax,
    applicationData?.permitData?.mailingAddress?.addressLine1,
    applicationData?.permitData?.mailingAddress?.addressLine2,
    applicationData?.permitData?.mailingAddress?.city,
    applicationData?.permitData?.mailingAddress?.countryCode,
    applicationData?.permitData?.mailingAddress?.provinceCode,
    applicationData?.permitData?.mailingAddress?.postalCode,
    applicationData?.permitData?.vehicleDetails?.unitNumber,
    applicationData?.permitData?.vehicleDetails?.vin,
    applicationData?.permitData?.vehicleDetails?.plate,
    applicationData?.permitData?.vehicleDetails?.make,
    applicationData?.permitData?.vehicleDetails?.year,
    applicationData?.permitData?.vehicleDetails?.countryCode,
    applicationData?.permitData?.vehicleDetails?.provinceCode,
    applicationData?.permitData?.vehicleDetails?.vehicleType,
    applicationData?.permitData?.vehicleDetails?.vehicleSubType,
    applicationData?.permitData?.vehicleDetails?.saveVehicle,
  ]);

  return {
    companyId,
    userDetails,
    defaultApplicationDataValues,
    setDefaultApplicationDataValues,
  };
};
