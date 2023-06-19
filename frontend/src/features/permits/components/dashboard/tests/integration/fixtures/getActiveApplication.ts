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
    permitData: Object,
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
      ...application,
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
