import { VEHICLES_API } from "./endpoints/endpoints";
import {
  PowerUnit,
  UpdatePowerUnit,
  VehicleType,
  Trailer,
  UpdateTrailer,
  VehicleTypesAsString,
  Vehicle,
} from "../types/managevehicles";

import {
  httpPOSTRequest,
  httpPUTRequest,
  getCompanyIdFromSession,
  httpGETRequest,
} from "../../../common/apiManager/httpRequestHandler";
import { replaceEmptyValuesWithNull } from "../../../common/helpers/util";
import { VEHICLES_URL } from "../../../common/apiManager/endpoints/endpoints";

/**
 * Fetch*
 * All Power Unit and Trailer Data
 * @return An array of combined PowerUnit and Trailers
 */
export const getAllVehicles = async (): Promise<(PowerUnit | Trailer)[]> => {
  const powerUnits = await getAllPowerUnits();
  const trailers = await getAllTrailers();

  powerUnits.forEach((p: PowerUnit) => {
    p.vehicleType = "powerUnit";
  });

  trailers.forEach((t: Trailer) => {
    t.vehicleType = "trailer";
  });

  const allVehicles: (PowerUnit | Trailer)[] = [...powerUnits, ...trailers];

  return allVehicles;
};

/**
 * Fetch*
 * All Power Unit Data
 * @return {*}  {Promise<void>}
 */
export const getAllPowerUnits = async (): Promise<PowerUnit[]> => {
  const url = `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/vehicles/powerUnits`;
  return httpGETRequest(url).then((response) => response.data);
};

/**
 * Gets a power unit by id.
 * @param powerUnitId The powerUnitId
 * @returns A Promise<Response> containing the API response.
 */
export const getPowerUnit = async (powerUnitId: string): Promise<PowerUnit> => {
  const url = `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/vehicles/powerUnits/${powerUnitId}`;
  return httpGETRequest(url).then((response) => response.data);
};

/**
 * Gets the power unit types.
 * @returns Array<PowerUnitType>
 */
export const getPowerUnitTypes = async (): Promise<Array<VehicleType>> => {
  const url = new URL(VEHICLES_API.POWER_UNIT_TYPES);
  return httpGETRequest(url.toString()).then((response) => response.data);
};

/**
 * Adds a power unit.
 * @param {PowerUnit} powerUnit The power unit to be added
 * @returns Promise containing the response from the create powerUnit API.
 */
export const addPowerUnit = (powerUnit: PowerUnit): Promise<Response> => {
  const url = `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/vehicles/powerUnits`;
  return httpPOSTRequest(url, replaceEmptyValuesWithNull(powerUnit));
};

/**
 * Updates a power unit.
 * @param {UpdatePowerUnit} powerUnit The power unit to be updated
 * @returns Response from the update powerUnit API.
 */
export const updatePowerUnit = ({
  powerUnit,
  powerUnitId,
}: {
  powerUnit: UpdatePowerUnit;
  powerUnitId: string;
}): Promise<Response> => {
  const url = `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/vehicles/powerUnits/${powerUnitId}`;
  return httpPUTRequest(url, replaceEmptyValuesWithNull(powerUnit));
};

/**
 * Fetch All Trailer Data
 * @return {Promise<Trailer[]>}  An array of trailers.
 */
export const getAllTrailers = async (): Promise<Trailer[]> => {
  const url = `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/vehicles/trailers`;
  return httpGETRequest(url).then((response) => response.data);
};

/**
 * Get Trailer by Id
 * @param trailerId The trailer to be retrieved.
 * @returns A Promise<Trailer> with data from the API.
 */
export const getTrailer = async (trailerId: string): Promise<Trailer> => {
  const url = `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/vehicles/trailers/${trailerId}`;
  return httpGETRequest(url).then((response) => response.data);
};

/**
 * Get Vehicle by Id
 * @param vehicleId The vehicle to be retrieved.
 * @returns A Promise<Vehicle> with data from the API.
 */
export const getVehicleById = async (
  vehicleId: string,
  vehicleType: VehicleTypesAsString
): Promise<Vehicle> => {
  let url = `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/vehicles`;
  if (vehicleType === "powerUnit") {
    url += `/powerUnits/${vehicleId}`;
  } else {
    url += `/trailers/${vehicleId}`;
  }
  return httpGETRequest(url).then((response) => response.data);
};

/**
 * Gets the trailer types.
 * @returns Array<VehicleType>
 */
export const getTrailerTypes = async (): Promise<Array<VehicleType>> => {
  const url = new URL(VEHICLES_API.TRAILER_TYPES);
  return httpGETRequest(url.toString()).then((response) => response.data);
};

/**
 * Adds a trailer.
 * @param {Trailer} trailer The trailer to be added
 * @returns Promise containing the response from the create trailer API.
 */
export const addTrailer = (trailer: Trailer): Promise<Response> => {
  const url = `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/vehicles/trailers`;
  return httpPOSTRequest(url, replaceEmptyValuesWithNull(trailer));
};

/**
 * Updates a trailer.
 * @param trailerId The trailer id to be updated.
 * @param trailer The trailer request object.
 * @returns A Promise<Response> containing the response from the API.
 */
export const updateTrailer = ({
  trailerId,
  trailer,
}: {
  trailerId: string;
  trailer: UpdateTrailer;
}): Promise<Response> => {
  const url = `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/vehicles/trailers/${trailerId}`;
  return httpPUTRequest(url, replaceEmptyValuesWithNull(trailer));
};

/**
 * Delete one or more vehicles.
 * @param vehicleIds Array of vehicle ids to be deleted.
 * @param vehicleType The {@link VehicleTypesAsString} to be deleted.
 * @returns A Promise with the API response.
 */
export const deleteVehicles = (
  vehicleIds: Array<string>,
  vehicleType: VehicleTypesAsString
): Promise<Response> => {
  let url: string | null = null;
  let requestBody: { powerUnits: Array<string> } | { trailers: Array<string> };
  if (vehicleType === "powerUnit") {
    url = `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/vehicles/powerUnits/delete-requests`;
    requestBody = { powerUnits: vehicleIds };
  } else {
    url = `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/vehicles/trailers/delete-requests`;
    requestBody = { trailers: vehicleIds };
  }
  return httpPOSTRequest(url, replaceEmptyValuesWithNull(requestBody));
};
