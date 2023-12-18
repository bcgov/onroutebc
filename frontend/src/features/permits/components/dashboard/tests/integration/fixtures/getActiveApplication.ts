import { factory, nullable, primaryKey } from "@mswjs/data";

import { ApplicationRequestData } from "../../../../../types/application";
import { getDefaultUserDetails } from "./getUserDetails";
import { getDefaultPowerUnits } from "./getVehicleInfo";
import { getDefaultCompanyInfo } from "./getCompanyInfo";
import { TROS_COMMODITIES } from "../../../../../constants/termOversizeConstants";
import { PERMIT_TYPES } from "../../../../../types/PermitType";
import { getExpiryDate } from "../../../../../helpers/permitState";
import {
  DATE_FORMATS,
  dayjsToLocalStr,
  getStartOfDate,
  now,
} from "../../../../../../../common/helpers/formatDate";

const activeApplicationSource = factory({
  application: {
    applicationNumber: primaryKey(String),
    permitId: nullable(String),
    permitStatus: nullable(String),
    companyId: Number,
    userGuid: nullable(String),
    permitType: String,
    permitNumber: nullable(String),
    permitApplicationOrigin: nullable(String),
    permitApprovalSource: nullable(String),
    revision: nullable(Number),
    previousRevision: nullable(String),
    createdDateTime: String,
    updatedDateTime: String,
    documentId: nullable(String),
    permitData: {
      startDate: String,
      permitDuration: Number,
      expiryDate: String,
      contactDetails: {
        firstName: nullable(String),
        lastName: nullable(String),
        phone1: nullable(String),
        phone1Extension: nullable(String),
        phone2: nullable(String),
        phone2Extension: nullable(String),
        email: nullable(String),
        fax: nullable(String),
      },
      vehicleDetails: {
        vin: nullable(String),
        plate: nullable(String),
        make: nullable(String),
        year: nullable(Number),
        countryCode: nullable(String),
        provinceCode: nullable(String),
        vehicleType: nullable(String),
        vehicleSubType: nullable(String),
        saveVehicle: nullable(Boolean),
        unitNumber: nullable(String),
      },
      commodities: Array,
      mailingAddress: {
        addressLine1: nullable(String),
        addressLine2: nullable(String),
        city: nullable(String),
        provinceCode: nullable(String),
        countryCode: nullable(String),
        postalCode: nullable(String),
      },
      feeSummary: nullable(String),
    },
  },
});

export const createApplication = (application: ApplicationRequestData) => {
  return activeApplicationSource.application.create({ ...application });
};
export const updateApplication = (
  application: ApplicationRequestData,
  applicationNumber: string,
) => {
  return activeApplicationSource.application.update({
    where: {
      applicationNumber: {
        equals: applicationNumber,
      },
    },
    data: {
      ...application,
    },
  });
};
export const getApplication = () => {
  const applications = activeApplicationSource.application.getAll();
  return applications.length > 0 ? applications[0] : undefined;
};

export const resetApplicationSource = () => {
  activeApplicationSource.application.deleteMany({
    where: {
      applicationNumber: {
        contains: "",
      },
    },
  });
};

export const getDefaultApplication = () => {
  const currentDt = getStartOfDate(now());
  const startDate = dayjsToLocalStr(currentDt, DATE_FORMATS.DATEONLY);
  const expiryDt = getExpiryDate(currentDt, 30);
  const expiryDate = dayjsToLocalStr(expiryDt, DATE_FORMATS.DATEONLY);
  const { companyId, userDetails } = getDefaultUserDetails();
  const contactDetails = {
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    phone1: userDetails.phone1,
    phone1Extension: userDetails.phone1Extension,
    phone2: userDetails.phone2,
    phone2Extension: userDetails.phone2Extension,
    email: userDetails.email,
    fax: userDetails.fax,
  };
  const vehicle = getDefaultPowerUnits()[0];
  const vehicleDetails = {
    vin: vehicle.vin,
    plate: vehicle.plate,
    make: vehicle.make,
    year: vehicle.year,
    countryCode: vehicle.countryCode,
    provinceCode: vehicle.provinceCode,
    vehicleType: "powerUnit",
    vehicleSubType: vehicle.powerUnitTypeCode,
    unitNumber: vehicle.unitNumber,
  };
  const commodities = [
    TROS_COMMODITIES[0],
    TROS_COMMODITIES[1],
    { ...TROS_COMMODITIES[2], checked: true },
  ];
  const { mailingAddress } = getDefaultCompanyInfo();

  return {
    companyId,
    userGuid: "AB1CD2EFAB34567CD89012E345FA678B",
    permitType: PERMIT_TYPES.TROS,
    permitData: {
      startDate,
      permitDuration: 30,
      expiryDate,
      contactDetails,
      vehicleDetails,
      commodities,
      mailingAddress,
    },
  };
};
