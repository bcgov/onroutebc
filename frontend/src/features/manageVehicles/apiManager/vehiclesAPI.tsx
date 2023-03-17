import { VEHICLES_API } from "./endpoints/endpoints";
import {
  PowerUnit,
  UpdatePowerUnit,
  VehicleType,
  Trailer,
} from "../types/managevehicles";

import {
  httpGETRequest,
  httpPOSTRequest,
  httpPUTRequest,
} from "../../../common/apiManager/httpRequestHandler";

/**
 * Creates the provinceID object within the API request body
 * If the province field is optional, then assign the provinceCode to be the same as the countryCode
 * Example: Country code is Canada, but the Province field is optional and set as "" then provinceId will be CA-CA
 * @param data Request data that is either PowerUnit or Trailer type
 * @returns provinceID as a string
 */
const createProvinceID = (data: PowerUnit | Trailer) => {
  if (!data.province) {
    data.province = data.country;
  }
  return `${data.country}-${data.province}`;
};

/**
 * Fetch*
 * All Power Unit Data
 * @return {*}  {Promise<void>}
 */
export const getAllPowerUnits = async (): Promise<PowerUnit[]> => {
  const url = new URL(VEHICLES_API.GET_ALL_POWER_UNITS);
  return httpGETRequest(url);
};

/**
 * Gets the power unit types.
 * @returns Array<PowerUnitType>
 */
export const getPowerUnitTypes = async (): Promise<Array<VehicleType>> => {
  const url = new URL(VEHICLES_API.POWER_UNIT_TYPES);
  return httpGETRequest(url);
};

/**
 * Adds a power unit.
 * @param {PowerUnit} powerUnit The power unit to be added
 * @returns Promise containing the response from the create powerUnit API.
 */
export const addPowerUnit = (powerUnit: PowerUnit): Promise<Response> => {
  powerUnit.provinceId = createProvinceID(powerUnit);
  return httpPOSTRequest(VEHICLES_API.POWER_UNIT, powerUnit);
};

/**
 * Updates a power unit.
 * @param {UpdatePowerUnit} powerUnit The power unit to be updated
 * @returns Response from the update powerUnit API.
 */
export const updatePowerUnit = (
  powerUnit: UpdatePowerUnit
): Promise<Response> => {
  return httpPUTRequest(VEHICLES_API.POWER_UNIT, powerUnit);
};

/**
 * Fetch*
 * All Trailer Data
 * @return {*}  {Promise<void>}
 */
export const getAllTrailers = async (): Promise<Trailer[]> => {
  const url = new URL(VEHICLES_API.GET_ALL_TRAILERS);
  return httpGETRequest(url);
};

/**
 * Gets the trailer types.
 * @returns Array<VehicleType>
 */
export const getTrailerTypes = async (): Promise<Array<VehicleType>> => {
  const url = new URL(VEHICLES_API.TRAILER_TYPES);
  return httpGETRequest(url);
};

/**
 * Adds a trailer.
 * @param {Trailer} trailer The trailer to be added
 * @returns Promise containing the response from the create trailer API.
 */
export const addTrailer = (trailer: Trailer): Promise<Response> => {
  trailer.provinceId = createProvinceID(trailer);
  return httpPOSTRequest(VEHICLES_API.TRAILER, trailer);
};
