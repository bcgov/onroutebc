/**
 * Utility to handle the interactions with Vehicle APIs.
 */

 const ONROUTE_BC_BACKEND_API_URL = process.env.REACT_APP_ONROUTE_BC_BACKEND_API_URL;

 /**
  * Adds a power unit.
  * @param {Array} route The route to be created
  * @returns Response from the Create Route API.
  */
  export const addPowerUnit = async (route) => {
     return fetch(`${ONROUTE_BC_BACKEND_API_URL}/route`, {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(route)
     })
     .then((response) => response.json());
 }