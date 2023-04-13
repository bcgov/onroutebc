import { VEHICLES_API, VEHICLE_URL } from "./endpoints/endpoints";
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
 *
 */
const getCompanyIdFromSession = (): string | null => {
  const userContextString = sessionStorage.getItem("onRoutebc.user.context");
  if (!userContextString) return null;
  const userContext = JSON.parse(userContextString);
  if (!userContext.companyId) return null;
  // Currently we only support one company per user.
  return userContext.companyId;
};

/**
 * Fetch*
 * All Power Unit Data
 * @return {*}  {Promise<void>}
 */
export const getAllPowerUnits = async (): Promise<PowerUnit[]> => {
  const url = new URL(
    `${VEHICLE_URL}/companies/${getCompanyIdFromSession()}/vehicles/powerUnits`
  );
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
  return httpPOSTRequest(
    `${VEHICLE_URL}/companies/${getCompanyIdFromSession()}/vehicles/powerUnits`,
    powerUnit
  );
};

/**
 * Updates a power unit.
 * @param {UpdatePowerUnit} powerUnit The power unit to be updated
 * @returns Response from the update powerUnit API.
 */
export const updatePowerUnit = (
  powerUnit: UpdatePowerUnit
): Promise<Response> => {
  return httpPUTRequest(
    `${VEHICLE_URL}/companies/${getCompanyIdFromSession()}/vehicles/powerUnits`,
    powerUnit
  );
};

/**
 * Fetch All Trailer Data
 * @return {Promise<Trailer[]>}  An array of trailers.
 */
export const getAllTrailers = async (): Promise<Trailer[]> => {
  const url = new URL(
    `${VEHICLE_URL}/companies/${getCompanyIdFromSession()}/vehicles/trailers`
  );
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
  return httpPOSTRequest(
    `${VEHICLE_URL}/companies/${getCompanyIdFromSession()}/vehicles/trailers`,
    trailer
  );
};
