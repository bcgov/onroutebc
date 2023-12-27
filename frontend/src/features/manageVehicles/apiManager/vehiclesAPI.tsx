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

import { replaceEmptyValuesWithNull } from "../../../common/helpers/util";
import { VEHICLES_URL } from "../../../common/apiManager/endpoints/endpoints";
import { RequiredOrNull } from "../../../common/types/common";
import {
  httpPOSTRequest,
  httpPUTRequest,
  httpGETRequest,
} from "../../../common/apiManager/httpRequestHandler";

/**
 * Fetch*
 * All Power Unit and Trailer Data
 * @return An array of combined PowerUnit and Trailers
 */
export const getAllVehicles = async (
  companyId: string,
): Promise<(PowerUnit | Trailer)[]> => {
  const powerUnits = await getAllPowerUnits(companyId);
  const trailers = await getAllTrailers(companyId);

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
export const getAllPowerUnits = async (
  companyId: string,
): Promise<PowerUnit[]> => {
  const url = `${VEHICLES_URL}/companies/${companyId}/vehicles/powerUnits`;
  return httpGETRequest(url).then((response) => response.data);
};

/**
 * Gets a power unit by id.
 * @param powerUnitId The powerUnitId
 * @returns A Promise<Response> containing the API response.
 */
export const getPowerUnit = async (
  powerUnitId: string,
  companyId: string,
): Promise<PowerUnit> => {
  const url = `${VEHICLES_URL}/companies/${companyId}/vehicles/powerUnits/${powerUnitId}`;
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
export const addPowerUnit = async ({
  powerUnit,
  companyId,
}: {
  powerUnit: PowerUnit;
  companyId: string;
}) => {
  const url = `${VEHICLES_URL}/companies/${companyId}/vehicles/powerUnits`;
  return await httpPOSTRequest(url, replaceEmptyValuesWithNull(powerUnit));
};

/**
 * Updates a power unit.
 * @param {UpdatePowerUnit} powerUnit The power unit to be updated
 * @returns Response from the update powerUnit API.
 */
export const updatePowerUnit = async ({
  powerUnit,
  powerUnitId,
  companyId,
}: {
  powerUnit: UpdatePowerUnit;
  powerUnitId: string;
  companyId: string;
}) => {
  const url = `${VEHICLES_URL}/companies/${companyId}/vehicles/powerUnits/${powerUnitId}`;
  return await httpPUTRequest(url, replaceEmptyValuesWithNull(powerUnit));
};

/**
 * Fetch All Trailer Data
 * @return {Promise<Trailer[]>}  An array of trailers.
 */
export const getAllTrailers = async (companyId: string): Promise<Trailer[]> => {
  const url = `${VEHICLES_URL}/companies/${companyId}/vehicles/trailers`;
  return httpGETRequest(url).then((response) => response.data);
};

/**
 * Get Trailer by Id
 * @param trailerId The trailer to be retrieved.
 * @returns A Promise<Trailer> with data from the API.
 */
export const getTrailer = async (
  trailerId: string,
  companyId: string,
): Promise<Trailer> => {
  const url = `${VEHICLES_URL}/companies/${companyId}/vehicles/trailers/${trailerId}`;
  return httpGETRequest(url).then((response) => response.data);
};

/**
 * Get Vehicle by Id
 * @param vehicleId The vehicle to be retrieved.
 * @returns A Promise<Vehicle> with data from the API.
 */
export const getVehicleById = async (
  companyId: string,
  vehicleType: VehicleTypesAsString,
  vehicleId?: string,
): Promise<RequiredOrNull<Vehicle>> => {
  if (!vehicleId) return null;

  let url = `${VEHICLES_URL}/companies/${companyId}/vehicles`;
  if (vehicleType === "powerUnit") {
    url += `/powerUnits/${vehicleId}`;
  } else {
    url += `/trailers/${vehicleId}`;
  }

  try {
    const response = await httpGETRequest(url);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
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
export const addTrailer = async ({
  trailer,
  companyId,
}: {
  trailer: Trailer;
  companyId: string;
}) => {
  const url = `${VEHICLES_URL}/companies/${companyId}/vehicles/trailers`;
  return await httpPOSTRequest(url, replaceEmptyValuesWithNull(trailer));
};

/**
 * Updates a trailer.
 * @param trailerId The trailer id to be updated.
 * @param trailer The trailer request object.
 * @returns A Promise<Response> containing the response from the API.
 */
export const updateTrailer = async ({
  trailerId,
  trailer,
  companyId,
}: {
  trailerId: string;
  trailer: UpdateTrailer;
  companyId: string;
}) => {
  const url = `${VEHICLES_URL}/companies/${companyId}/vehicles/trailers/${trailerId}`;
  return await httpPUTRequest(url, replaceEmptyValuesWithNull(trailer));
};

/**
 * Delete one or more vehicles.
 * @param vehicleIds Array of vehicle ids to be deleted.
 * @param vehicleType The {@link VehicleTypesAsString} to be deleted.
 * @returns A Promise with the API response.
 */
export const deleteVehicles = async (
  vehicleIds: Array<string>,
  vehicleType: VehicleTypesAsString,
  companyId: string,
) => {
  let url: RequiredOrNull<string> = null;
  let requestBody: { powerUnits: Array<string> } | { trailers: Array<string> };
  if (vehicleType === "powerUnit") {
    url = `${VEHICLES_URL}/companies/${companyId}/vehicles/powerUnits/delete-requests`;
    requestBody = { powerUnits: vehicleIds };
  } else {
    url = `${VEHICLES_URL}/companies/${companyId}/vehicles/trailers/delete-requests`;
    requestBody = { trailers: vehicleIds };
  }
  return await httpPOSTRequest(url, replaceEmptyValuesWithNull(requestBody));
};
