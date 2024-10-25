import { DATE_FORMATS, dayjsToLocalStr } from "../../../common/helpers/formatDate";
import {
  ApplicationFormData,
  CreateApplicationRequestData,
  UpdateApplicationRequestData,
} from "../types/application";

/**
 * Serializes Application form data to CreateApplicationRequestData.
 * The result can be used as payload for create application requests.
 * @param application Application form data
 * @returns CreateApplicationRequestData object used for payload data to request to backend
 */
export const serializeForCreateApplication = (
  application: ApplicationFormData,
): CreateApplicationRequestData => {
  const {
    permitId,
    originalPermitId,
    applicationNumber,
    permitType,
    permitData: {
      startDate,
      expiryDate,
      permittedRoute,
      ...restOfPermitData
    },
    comment,
  } = application;

  const serializedPermittedRoute = permittedRoute
    ? {
      manualRoute: permittedRoute.manualRoute
        ? {
          ...permittedRoute.manualRoute,
          highwaySequence: permittedRoute.manualRoute.highwaySequence
            .filter(highwayNumber => Boolean(highwayNumber.trim())),
        }
        : null,
      routeDetails: permittedRoute.routeDetails,
    }
    : null;

  return {
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
      permittedRoute: serializedPermittedRoute,
    },
  };
};

/**
 * Serializes Application form data to UpdateApplicationRequestData.
 * The result can be used as payload for update application requests.
 * @param application Application form data
 * @returns UpdateApplicationRequestData object used for payload to request to backend
 */
export const serializeForUpdateApplication = (
  application: ApplicationFormData,
): UpdateApplicationRequestData => {
  const {
    permitType,
    comment,
    permitData: {
      startDate,
      expiryDate,
      permittedRoute,
      ...restOfPermitData
    },
  } = application;

  const serializedPermittedRoute = permittedRoute
    ? {
      manualRoute: permittedRoute.manualRoute
        ? {
          ...permittedRoute.manualRoute,
          highwaySequence: permittedRoute.manualRoute.highwaySequence
            .filter(highwayNumber => Boolean(highwayNumber.trim())),
        }
        : null,
      routeDetails: permittedRoute.routeDetails,
    }
    : null;

  return {
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
      permittedRoute: serializedPermittedRoute,
    },
  };
};
