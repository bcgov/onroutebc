import { replaceEmptyValuesWithNull } from "../helpers/util";
import { OrbcError } from "../types/common";
import { VEHICLES_URL } from "./endpoints/endpoints";
import { getCompanyIdFromSession, httpPOSTRequest } from "./httpRequestHandler";


/**
 * Adds an error.
 * @param {OrbcError} error The error to be added
 * @returns Promise containing the error from the create error API.
 */
export const addOrbcError = async (error: OrbcError) => {
  const url = `${VEHICLES_URL}/errors`;
  return await httpPOSTRequest(url, replaceEmptyValuesWithNull(error));
};

