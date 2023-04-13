import { VEHICLES_API, VEHICLE_URL } from "./endpoints/endpoints";
import {
  PowerUnit,
  UpdatePowerUnit,
  VehicleType,
  Trailer,
  VehicleTypesAsString,
} from "../types/managevehicles";

import {
  httpDELETERequest,
  httpGETRequest,
  httpPOSTRequest,
  httpPUTRequest,
  getCompanyIdFromSession,
} from "../../../common/apiManager/httpRequestHandler";

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

/**
 * Deletes a vehicle.
 * @param vehicleId The vehicle to be deleted.
 * @param vehicleType The {@link VehicleTypesAsString} to be deleted.
 * @returns A Promise with the API response.
 */
export const deleteVehicle = (
  vehicleId: string,
  vehicleType: VehicleTypesAsString
): Promise<Response> => {
  let url: string | null = null;
  if (vehicleType === "powerUnit") {
    url = VEHICLES_API.POWER_UNIT;
  } else {
    url = VEHICLES_API.TRAILER;
  }
  return httpDELETERequest(`${url}/${vehicleId}`);
};

/**
 * Delete one or more vehicles.
 * @param vehicleIds Array of vehicle ids to be deleted.
 * @param vehicleType The {@link VehicleTypesAsString} to be deleted.
 * @param companyId The company id the vehicles are part of.
 * @returns A Promise with the API response.
 */
export const deleteVehicles = (
  vehicleIds: Array<string>,
  vehicleType: VehicleTypesAsString,
  companyId = "12" // Remove hardcoded value
): Promise<Response> => {
  let url: string | null = null;
  let requestBody: { powerUnits: Array<string> } | { trailers: Array<string> };
  if (vehicleType === "powerUnit") {
    url = VEHICLES_API.POWER_UNIT;
    requestBody = { powerUnits: vehicleIds };
  } else {
    url = VEHICLES_API.TRAILER;
    requestBody = { trailers: vehicleIds };
  }
  return httpPOSTRequest(`${url}/delete-requests/${companyId}`, requestBody);
};
