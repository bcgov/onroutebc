import { Dayjs } from "dayjs";
import { applyWhenNotNullable } from "../../../common/helpers/util";
import {
  PowerUnit,
  Trailer,
  VehicleType,
  VehicleTypes,
} from "../../manageVehicles/types/managevehicles";
import { Application, ApplicationRequestData, ApplicationResponse } from "../types/application";
import { dayjsToUtcStr, now, toLocalDayjs } from "../../../common/helpers/formatDate";

/**
 * This helper function is used to get the vehicle object that matches the vin prop
 * If there are multiple vehicles with the same vin, then return the first vehicle
 * @param vehicles list of vehicles
 * @param vin string used as a key to find the existing vehicle
 * @returns a PowerUnit or Trailer object, or undefined
 */
export const mapVinToVehicleObject = (
  vehicles: VehicleTypes[] | undefined,
  vin: string
): PowerUnit | Trailer | undefined => {
  if (!vehicles) return undefined;

  const existingVehicles = vehicles.filter((item) => {
    return item.vin === vin;
  });

  if (!existingVehicles) return undefined;

  return existingVehicles[0];
};

/**
 * Maps the typeCode (Example: GRADERS) to the TrailerType or PowerUnitType object, then return that object
 * @param typeCode
 * @param vehicleType
 * @param powerUnitTypes
 * @param trailerTypes
 * @returns A Vehicle Sub type object
 */
export const mapTypeCodeToObject = (
  typeCode: string,
  vehicleType: string,
  powerUnitTypes: VehicleType[] | undefined,
  trailerTypes: VehicleType[] | undefined
) => {
  let typeObject = undefined;

  if (powerUnitTypes && vehicleType === "powerUnit") {
    typeObject = powerUnitTypes.find((v) => {
      return v.typeCode == typeCode;
    });
  } else if (trailerTypes && vehicleType === "trailer") {
    typeObject = trailerTypes.find((v) => {
      return v.typeCode == typeCode;
    });
  }

  return typeObject;
};

export const mapApplicationResponseToApplication = (response: ApplicationResponse): Application => {
  return {
    ...response,
    createdDateTime: applyWhenNotNullable(
      (datetimeStr: string): Dayjs => toLocalDayjs(datetimeStr),
      response.createdDateTime,
      undefined
    ),
    updatedDateTime: applyWhenNotNullable(
      (datetimeStr: string): Dayjs => toLocalDayjs(datetimeStr),
      response.updatedDateTime,
      undefined
    ),
    permitData: {
      ...response.permitData,
      startDate: applyWhenNotNullable(
        (datetimeStr: string): Dayjs => toLocalDayjs(datetimeStr),
        response.permitData.startDate,
        now()
      ),
      expiryDate: applyWhenNotNullable(
        (datetimeStr: string): Dayjs => toLocalDayjs(datetimeStr),
        response.permitData.expiryDate,
        now()
      ),
    }
  };
};

export const mapApplicationToApplicationRequestData = (data: Application): ApplicationRequestData => {
  return {
    ...data,
    createdDateTime: applyWhenNotNullable(
      dayjsToUtcStr,
      data.createdDateTime,
      undefined
    ),
    updatedDateTime: applyWhenNotNullable(
      dayjsToUtcStr,
      data.updatedDateTime,
      undefined
    ),
    permitData: {
      ...data.permitData,
      startDate: dayjsToUtcStr(data.permitData.startDate),
      expiryDate: dayjsToUtcStr(data.permitData.expiryDate),
    }
  };
};
