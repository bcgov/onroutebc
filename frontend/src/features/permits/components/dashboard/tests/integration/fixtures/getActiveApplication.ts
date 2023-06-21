import { factory, nullable, primaryKey } from "@mswjs/data";
import { ApplicationRequestData } from "../../../../../types/application";

const activeApplicationSource = factory({
  application: {
    applicationNumber: primaryKey(String),
    permitId: nullable(Number),
    permitStatus: nullable(String),
    companyId: Number,
    userGuid: nullable(String),
    permitType: String,
    permitNumber: nullable(Number),
    permitApprovalSource: nullable(String),
    createdDateTime: String,
    updatedDateTime: String,
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
  }
});

export const createApplication = (application: ApplicationRequestData) => {
  return activeApplicationSource.application.create({...application});
};
export const updateApplication = (application: ApplicationRequestData, applicationNumber: string) => {
  return activeApplicationSource.application.update({
    where: {
      applicationNumber: {
        equals: applicationNumber
      }
    },
    data: {
      ...application
    }
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
        contains: ""
      }
    }
  });
};
