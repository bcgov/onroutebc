import { PowerUnit } from "../types";

/**
 * Utility to handle the interactions with Vehicle APIs.
 */

const ONROUTE_BC_BACKEND_API_URL =
  "process.env.REACT_APP_ONROUTE_BC_BACKEND_API_URL";

/**
 * Adds a power unit.
 * @param {PowerUnit} powerUnit The power unit to be added
 * @returns Response from the create powerUnit API.
 */
export const addPowerUnit = async (powerUnit: PowerUnit) => {
  return fetch(`${ONROUTE_BC_BACKEND_API_URL}/powerUnit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(powerUnit),
  }).then((response) => response.json());
};

/**
 * Updates a power unit.
 * @param {PowerUnit} powerUnit The power unit to be added
 * @returns Response from the create powerUnit API.
 */
 export const updatePowerUnit = async (powerUnit: PowerUnit) => {
    return fetch(`${ONROUTE_BC_BACKEND_API_URL}/powerUnit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(powerUnit),
    }).then((response) => response.json());
  };
