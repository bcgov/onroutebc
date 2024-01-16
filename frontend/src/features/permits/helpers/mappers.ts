import { Dayjs } from "dayjs";

import { Permit } from "../types/permit";
import { applyWhenNotNullable } from "../../../common/helpers/util";
import { Nullable, Optional } from "../../../common/types/common";
import { getDurationOrDefault } from "./getDefaultApplicationFormData";
import { getExpiryDate } from "./permitState";
import {
  VehicleSubType,
  Vehicle,
  VehicleType,
  VEHICLE_TYPES,
  PowerUnit,
  Trailer,
} from "../../manageVehicles/types/Vehicle";

import {
  Application,
  ApplicationRequestData,
  ApplicationResponse,
} from "../types/application";

import {
  DATE_FORMATS,
  dayjsToLocalStr,
  dayjsToUtcStr,
  getEndOfDate,
  getStartOfDate,
  now,
  toLocalDayjs,
  utcToLocalDayjs,
} from "../../../common/helpers/formatDate";

/**
 * This helper function is used to get the vehicle object that matches the vehicleType and id.
 * @param vehicles List of existing vehicles
 * @param vehicleType Type of vehicle
 * @param id string used as a key to find the existing vehicle
 * @returns The found Vehicle object in the provided list, or undefined if not found
 */
export const mapToVehicleObjectById = (
  vehicles: Optional<Vehicle[]>,
  vehicleType: VehicleType,
  id: Nullable<string>,
): Optional<Vehicle> => {
  if (!vehicles) return undefined;

  return vehicles.find((item) => {
    return vehicleType === VEHICLE_TYPES.POWER_UNIT ? 
      (item.vehicleType === VEHICLE_TYPES.POWER_UNIT && (item as PowerUnit).powerUnitId === id) :
      (item.vehicleType === VEHICLE_TYPES.TRAILER && (item as Trailer).trailerId === id);
  });
};

/**
 * Maps the typeCode (Example: GRADERS) to the corresponding Trailer or PowerUnit subtype object, then return that object
 * @param typeCode
 * @param vehicleType
 * @param powerUnitSubTypes
 * @param trailerSubTypes
 * @returns A Vehicle Sub type object
 */
export const mapTypeCodeToObject = (
  typeCode: string,
  vehicleType: string,
  powerUnitSubTypes: Optional<VehicleSubType[]>,
  trailerSubTypes: Optional<VehicleSubType[]>,
) => {
  let typeObject = undefined;

  if (powerUnitSubTypes && vehicleType === VEHICLE_TYPES.POWER_UNIT) {
    typeObject = powerUnitSubTypes.find((v) => {
      return v.typeCode == typeCode;
    });
  } else if (trailerSubTypes && vehicleType === VEHICLE_TYPES.TRAILER) {
    typeObject = trailerSubTypes.find((v) => {
      return v.typeCode == typeCode;
    });
  }

  return typeObject;
};

/**
 * Maps/transforms an ApplicationResponse (with string for dates) to an Application object (Dayjs object for dates)
 * @param response ApplicationResponse object received as response data from backend
 * @returns converted Application object that can be used by form fields and the front-end app
 */
export const mapApplicationResponseToApplication = (
  response: ApplicationResponse,
): Application => {
  const startDateOrDefault = applyWhenNotNullable(
    (datetimeStr: string): Dayjs => getStartOfDate(toLocalDayjs(datetimeStr)),
    response.permitData.startDate,
    getStartOfDate(now()),
  );

  const durationOrDefault = getDurationOrDefault(
    30,
    response.permitData.permitDuration,
  );

  const expiryDateOrDefault = applyWhenNotNullable(
    (datetimeStr: string): Dayjs => getEndOfDate(toLocalDayjs(datetimeStr)),
    response.permitData.expiryDate,
    getExpiryDate(startDateOrDefault, durationOrDefault),
  );

  return {
    ...response,
    createdDateTime: applyWhenNotNullable(
      (datetimeStr: string): Dayjs => utcToLocalDayjs(datetimeStr),
      response.createdDateTime,
    ),
    updatedDateTime: applyWhenNotNullable(
      (datetimeStr: string): Dayjs => utcToLocalDayjs(datetimeStr),
      response.updatedDateTime,
    ),
    permitData: {
      ...response.permitData,
      startDate: startDateOrDefault,
      expiryDate: expiryDateOrDefault,
    },
  };
};

/**
 * Maps/transforms Application form data into ApplicationRequestData so it can be used as payload for backend requests
 * @param data Application form data
 * @returns ApplicationRequestData object that's used for payload to request to backend
 */
export const mapApplicationToApplicationRequestData = (
  data: Application,
): ApplicationRequestData => {
  return {
    ...data,
    createdDateTime: applyWhenNotNullable(dayjsToUtcStr, data.createdDateTime),
    updatedDateTime: applyWhenNotNullable(dayjsToUtcStr, data.updatedDateTime),
    permitData: {
      ...data.permitData,
      startDate: dayjsToLocalStr(
        data.permitData.startDate,
        DATE_FORMATS.DATEONLY,
      ),
      expiryDate: dayjsToLocalStr(
        data.permitData.expiryDate,
        DATE_FORMATS.DATEONLY,
      ),
    },
  };
};

/**
 * Gets display text for vehicle type.
 * @param vehicleType Vehicle type (powerUnit or trailer)
 * @returns display text for the vehicle type
 */
export const vehicleTypeDisplayText = (vehicleType: VehicleType) => {
  if (vehicleType === VEHICLE_TYPES.TRAILER) {
    return "Trailer";
  }
  return "Power Unit";
};

/**
 * Get a cloned permit.
 * @param permit Permit to clone
 * @returns Cloned permit with same fields and nested fields as old permit, but different reference
 */
export const clonePermit = (permit: Permit): Permit => {
  return {
    ...permit,
    permitData: {
      ...permit.permitData,
      contactDetails: permit.permitData.contactDetails
        ? {
            ...permit.permitData.contactDetails,
          }
        : undefined,
      vehicleDetails: permit.permitData.vehicleDetails
        ? {
            ...permit.permitData.vehicleDetails,
          }
        : undefined,
      commodities: [...permit.permitData.commodities],
      mailingAddress: {
        ...permit.permitData.mailingAddress,
      },
    },
  };
};

/**
 * Transform a Permit object into an Application object.
 * @param permit Permit object to transform
 * @returns Transformed Application object
 */
export const transformPermitToApplication = (permit: Permit) => {
  const startDateOrDefault = applyWhenNotNullable(
    (datetimeStr: string): Dayjs => getStartOfDate(toLocalDayjs(datetimeStr)),
    permit.permitData.startDate,
    getStartOfDate(now()),
  );

  const durationOrDefault = getDurationOrDefault(
    30,
    permit.permitData.permitDuration,
  );

  const expiryDateOrDefault = applyWhenNotNullable(
    (datetimeStr: string): Dayjs => getEndOfDate(toLocalDayjs(datetimeStr)),
    permit.permitData.expiryDate,
    getExpiryDate(startDateOrDefault, durationOrDefault),
  );

  return {
    ...permit,
    permitId: `${permit.permitId}`,
    previousRevision: applyWhenNotNullable(
      (prevRev) => `${prevRev}`,
      permit.previousRevision,
    ),
    createdDateTime: applyWhenNotNullable(
      (datetimeStr: string): Dayjs => utcToLocalDayjs(datetimeStr),
      permit.createdDateTime,
    ),
    updatedDateTime: applyWhenNotNullable(
      (datetimeStr: string): Dayjs => utcToLocalDayjs(datetimeStr),
      permit.updatedDateTime,
    ),
    permitData: {
      ...permit.permitData,
      startDate: startDateOrDefault,
      expiryDate: expiryDateOrDefault,
    },
  };
};

/**
 * Transform an Application object into a Permit object. Some permit fields may not be required.
 * @param application Application object to transform
 * @returns Transformed Permit object
 */
export const transformApplicationToPermit = (
  application: Application,
): Omit<
  Permit,
  | "originalPermitId"
  | "applicationNumber"
  | "permitNumber"
  | "permitApplicationOrigin"
  | "permitApprovalSource"
  | "revision"
> &
  Pick<
    Application,
    | "originalPermitId"
    | "applicationNumber"
    | "permitNumber"
    | "permitApplicationOrigin"
    | "permitApprovalSource"
    | "revision"
  > => {
  return {
    ...application,
    permitId: applyWhenNotNullable((id) => +id, application.permitId),
    previousRevision: applyWhenNotNullable(
      (prevRev) => +prevRev,
      application.previousRevision,
    ),
    createdDateTime: applyWhenNotNullable(
      dayjsToUtcStr,
      application.createdDateTime,
    ),
    updatedDateTime: applyWhenNotNullable(
      dayjsToUtcStr,
      application.updatedDateTime,
    ),
    permitData: {
      ...application.permitData,
      startDate: dayjsToLocalStr(
        application.permitData.startDate,
        DATE_FORMATS.DATEONLY,
      ),
      expiryDate: dayjsToLocalStr(
        application.permitData.expiryDate,
        DATE_FORMATS.DATEONLY,
      ),
    },
  };
};
