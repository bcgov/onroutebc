import { PowerUnit } from '../types';

/**
 * Utility to handle the interactions with Vehicle APIs.
 */

 const ONROUTE_BC_BACKEND_API_URL = process.env.REACT_APP_ONROUTE_BC_BACKEND_API_URL;

 /**
  * Adds a power unit.
  * @param {PowerUnit} powerUnit The route to be created
  * @returns Response from the Create Route API.
  */
  export const addPowerUnit = async (powerUnit: PowerUnit) => {
     return fetch(`${ONROUTE_BC_BACKEND_API_URL}/powerUnit`, {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(powerUnit)
     })
     .then((response) => response.json());
 }