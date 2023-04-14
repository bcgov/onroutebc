import { VEHICLES_API, VEHICLE_URL } from "./endpoints/endpoints";
import {
  PowerUnit,
  UpdatePowerUnit,
  VehicleType,
  Trailer,
  UpdateTrailer,
} from "../types/managevehicles";

import {
  httpGETRequest,
  httpPOSTRequest,
  httpPUTRequest,
  getCompanyIdFromSession,
} from "../../../common/apiManager/httpRequestHandler";

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

export const updateTrailer = (trailer: UpdateTrailer): Promise<Response> => {
  const url = VEHICLES_API.TRAILER + "/" + trailer.trailerId;
  return httpPUTRequest(url, trailer);
};
