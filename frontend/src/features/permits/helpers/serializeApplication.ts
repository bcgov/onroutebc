import { DATE_FORMATS, dayjsToLocalStr } from "../../../common/helpers/formatDate";
import {
  ApplicationFormData,
  CreateApplicationRequestData,
  UpdateApplicationRequestData,
} from "../types/application";

/**
 * Serializes Application form data to CreateApplicationRequestData so it can be used as payload for create application requests.
 * @param application Application form data
 * @returns CreateApplicationRequestData object used for payload data to request to backend
 */
export const serializeForCreateApplication = (
  application: ApplicationFormData,
): CreateApplicationRequestData => {
  const {
    companyId,
    permitId,
    originalPermitId,
    applicationNumber,
    permitType,
    permitData: {
      startDate,
      expiryDate,
      ...restOfPermitData
    },
    comment,
  } = application;

  return {
    companyId,
    permitId,
    originalPermitId,
    applicationNumber,
    permitType,
    comment,
    permitData: {
      ...restOfPermitData,
      startDate: dayjsToLocalStr(
        startDate,
        DATE_FORMATS.DATEONLY,
      ),
      expiryDate: dayjsToLocalStr(
        expiryDate,
        DATE_FORMATS.DATEONLY,
      ),
    },
  };
};

/**
 * Serializes Application form data to UpdateApplicationRequestData so it can be used as payload for update application requests
 * @param application Application form data
 * @returns UpdateApplicationRequestData object used for payload to request to backend
 */
export const serializeForUpdateApplication = (
  application: ApplicationFormData,
): UpdateApplicationRequestData => {
  const {
    companyId,
    permitType,
    comment,
    permitData: {
      startDate,
      expiryDate,
      ...restOfPermitData
    },
  } = application;

  return {
    companyId,
    permitType,
    comment,
    permitData: {
      ...restOfPermitData,
      startDate: dayjsToLocalStr(
        startDate,
        DATE_FORMATS.DATEONLY,
      ),
      expiryDate: dayjsToLocalStr(
        expiryDate,
        DATE_FORMATS.DATEONLY,
      ),
    },
  };
};
