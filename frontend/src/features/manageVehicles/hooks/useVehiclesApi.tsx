import { IPowerUnit } from "../types/managevehicles";
import { CreatePowerUnit, PowerUnitType } from "../types";
import { VEHICLES_API, VEHICLE_URL } from "./endpoints/endpoints";

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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Gets the power unit types.
 * @returns Array<PowerUnitType>
 */
export const getPowerUnitTypes = async (): Promise<Array<PowerUnitType>> => {
  await delay(1000);
  return [
    {
      description: "XYZ",
      type: "CONCRETE TRUCKS",
      typeCode: "CONCRET"
    }
  ]
  // return fetch(`${VEHICLES_API.POWER_UNIT_TYPES}`).then((response) =>
  //   response.json()
  // );
};

/**
 * Adds a power unit.
 * @param {CreatePowerUnit} powerUnit The power unit to be added
 * @returns Response from the create powerUnit API.
 */
export const addPowerUnit = (powerUnit: CreatePowerUnit) => {
  return fetch(`${VEHICLES_API.POWER_UNIT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(powerUnit),
  }).then((response) => response.json());
};

/**
 * Updates a power unit.
 * @param {CreatePowerUnit} powerUnit The power unit to be added
 * @returns Response from the create powerUnit API.
 */
export const updatePowerUnit = (powerUnit: CreatePowerUnit) => {
  return fetch(`${VEHICLES_API.POWER_UNIT}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(powerUnit),
  }).then((response) => response.json());
};
