import { VEHICLES_API } from "./endpoints/endpoints";
import {
  IPowerUnit,
  CreatePowerUnit,
  UpdatePowerUnit,
  PowerUnitType,
  ApiErrorResponse,
} from "../types/managevehicles";

/*
 *
 * API Manager for the Manage Vehicles feature
 *
 */

/**
 * Fetch*
 * All Power Unit Data
 * @return {*}  {Promise<void>}
 */
export const getAllPowerUnits = async (): Promise<IPowerUnit[]> => {
  const url = new URL(VEHICLES_API.GET_ALL_POWER_UNITS);

  try {
    /*
      // Use for testing error response
      const response = await fetch(
        "http://localhost:5000/vehicles/powerUnits/1111",
        { method: "DELETE" }
      );
      */

    const response = await fetch(url.href);
    const data = await response.json();

    // Handle API errors created from the backend API
    if (!response.ok) {
      const err: ApiErrorResponse = data;
      return Promise.reject(err.errorMessage);
    }
    return data;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle network errors
    // Error type has name and message
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return Promise.reject(error.message);
  }
};

/**
 * Gets the power unit types.
 * @returns Array<PowerUnitType>
 */
export const getPowerUnitTypes = async (): Promise<Array<PowerUnitType>> => {
  return fetch(`${VEHICLES_API.POWER_UNIT_TYPES}`).then((response) =>
    response.json()
  );
};

/**
 * Adds a power unit.
 * @param {CreatePowerUnit} powerUnit The power unit to be added
 * @returns Promise containing the response from the create powerUnit API.
 */
export const addPowerUnit = (powerUnit: CreatePowerUnit): Promise<Response> => {
  return fetch(`${VEHICLES_API.POWER_UNIT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(powerUnit),
  });
};

/**
 * Updates a power unit.
 * @param {UpdatePowerUnit} powerUnit The power unit to be updated
 * @returns Response from the update powerUnit API.
 */
export const updatePowerUnit = (
  powerUnit: UpdatePowerUnit
): Promise<Response> => {
  return fetch(`${VEHICLES_API.POWER_UNIT}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(powerUnit),
  });
};
