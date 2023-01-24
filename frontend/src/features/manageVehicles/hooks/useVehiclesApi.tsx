import {
  IPowerUnit,
  CreatePowerUnit,
  UpdatePowerUnit,
  PowerUnitType,
} from "../types/managevehicles";
import { VEHICLES_API } from "./endpoints/endpoints";

/*
 *
 * API Manager for the Manage Vehicles feature
 *
 */

export const useVehiclesApi = () => {
  /**
   * Fetch*
   All Power Unit Data
   * @return {*}  {Promise<void>}
   */
  const getAllPowerUnits = async (): Promise<IPowerUnit[]> => {
    const url = new URL(VEHICLES_API.GET_ALL_POWER_UNITS);

    try {
      const response = await fetch(url.href);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return { getAllPowerUnits };
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
