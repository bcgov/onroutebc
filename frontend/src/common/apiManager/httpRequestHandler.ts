import axios from "axios";
import {
  applyWhenNotNullable,
  getDefaultNullableVal,
  getDefaultRequiredVal,
} from "../helpers/util";

// Add environment variables to get the full key.
// Full key structure: oidc.user:${AUTH0_ISSUER_URL}:${AUTH0_AUDIENCE}
// Full key example:: oidc.user:https://dev.loginproxy.gov.bc.ca/auth/realms/standard:on-route-bc-direct-4598
const getUserStorageKey = () =>
  Object.keys(sessionStorage).find((key) => key.startsWith("oidc.user"));

/**
 * Retrieves user's sessionStorage item based on provided key.
 *
 * @returns JSON parsed object, or undefined if item not found in sessionStorage.
 */
const getUserStorage = () => {
  const storageKey = getDefaultRequiredVal("", getUserStorageKey());
  return applyWhenNotNullable(JSON.parse, sessionStorage.getItem(storageKey));
};

/**
 * Retrieves the access token from session.
 * @returns A string containing the access token.
 */
const getAccessToken = () => {
  const parsedSessionObject = getDefaultRequiredVal(
    { token_type: "", access_token: "" },
    getUserStorage()
  );
  const tokenType = String(
    getDefaultRequiredVal("", parsedSessionObject["token_type"])
  );
  const accessToken = String(
    getDefaultRequiredVal("", parsedSessionObject["access_token"])
  );
  return tokenType.trim() !== "" && accessToken.trim() !== ""
    ? `${parsedSessionObject["token_type"]} ${parsedSessionObject["access_token"]}`
    : "";
};

/**
 * Retrieves the correlation Id.
 * @returns A string containing the correlation id.
 */
const getCorrelationId = () => {
  return sessionStorage.getItem("correlationid");
};

/**
 * Retrieves the companyId from the session.
 * @returns string | null
 */
export const getCompanyIdFromSession = (): string | null => {
  return sessionStorage.getItem("onRouteBC.user.companyId");
};

/**
 * Retrieves user's GUID from session.
 * @returns string | null
 */
export const getUserGuidFromSession = (): string | null => {
  const parsedSessionObject = getDefaultRequiredVal(
    { profile: { bceid_user_guid: "" } },
    getUserStorage()
  );

  return parsedSessionObject.profile?.bceid_user_guid ?? null;
};

/**
 * Retrieves company name from session.
 * @returns string | null
 */
export const getCompanyNameFromSession = (): string | undefined => {
  const parsedSessionObject = getDefaultRequiredVal(
    { profile: { bceid_business_name: "" } },
    getUserStorage()
  );

  return getDefaultNullableVal(
    parsedSessionObject.profile?.bceid_business_name
  );
};

/**
 * Retrieves username from session
 * @returns username or empty string
 */
export const getLoginUsernameFromSession = (): string => {
  const parsedSessionObject = getUserStorage();
  if (!parsedSessionObject) return "";
  return getDefaultRequiredVal(
    "", 
    parsedSessionObject.profile?.bceid_username,
    parsedSessionObject.profile?.idir_username,
  );
};

/**
 * Retrieves company email from session.
 * @returns string | undefined
 */
export const getCompanyEmailFromSession = (): string | undefined => {
  const parsedSessionObject = getDefaultRequiredVal(
    { profile: { email: "" } },
    getUserStorage()
  );

  return getDefaultNullableVal(
    parsedSessionObject.profile?.email
  );
};

/**
 * A generic HTTP GET Request
 * @param url The URL of the resource.
 * @returns A Promise<Response> with the response from the API.
 */
export const httpGETRequest = (url: string) => {
  return axios.get(url, {
    headers: {
      Authorization: getAccessToken(),
    },
  });
};

/**
 * A HTTP GET Request for streams
 * @param url The URL of the resource.
 * @returns A Promise<Response> with the response from the API.
 */
export const httpGETRequestStream = (url: string) => {
  return fetch(url, {
    headers: {
      "Authorization": getAccessToken(),
    },
  });
};

/**
 * A generic HTTP POST Request
 * @param url The URL of the resource.
 * @param data The request payload.
 * @returns A Promise<Response> with the response from the API.
 */
export const httpPOSTRequest = (url: string, data: any) => {
  return axios.post(url, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: getAccessToken(),
      "X-Correlation-ID": getCorrelationId(),
    },
  });
};

/**
 * A generic HTTP PUT Request
 * @param url The URL of the resource.
 * @param data The request payload.
 * @returns A Promise<Response> with the response from the API.
 */
export const httpPUTRequest = (url: string, data: any) => {
  return axios.put(url, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: getAccessToken(),
      "X-Correlation-ID": getCorrelationId(),
    },
  });
};

/**
 * HTTP Delete Request
 * @param url The URL containing the resource id to be deleted.
 * @returns A Promise<Response> with the response from the API.
 */
export const httpDELETERequest = (url: string) => {
  return axios.delete(url, {
    headers: {
      Authorization: getAccessToken(),
      "X-Correlation-ID": getCorrelationId(),
    },
  });
};
