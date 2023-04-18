import { ApiErrorResponse } from "../types/common";

/**
 * Retrieves the access token from session.
 * @returns A string containing the access token.
 */
const getAccessToken = () => {
  // Add environment variables to get the full key.
  // Full key structure: oidc.user:${AUTH0_ISSUER_URL}:${AUTH0_AUDIENCE}
  // Full key example:: oidc.user:https://dev.loginproxy.gov.bc.ca/auth/realms/standard:on-route-bc-direct-4598
  const storageKey: string = Object.keys(sessionStorage).find((key) =>
    key.startsWith("oidc.user")
  ) as string;
  const parsedSessionObject = JSON.parse(
    sessionStorage.getItem(storageKey) as string
  );
  return (
    parsedSessionObject["token_type"] +
    " " +
    parsedSessionObject["access_token"]
  );
};

/**
 * Retrieves the companyId from the session.
 * @returns string | null
 */
export const getCompanyIdFromSession = (): string | null => {
  const userContextString = sessionStorage.getItem("onRoutebc.user.context");
  if (!userContextString) return null;

  const userContext = JSON.parse(userContextString);

  if (!userContext.companyId) return null;

  // Currently we only support one company per user.
  return userContext.companyId;
};

export const httpGETRequest = async (url: URL) => {
  try {
    const response = await fetch(url.href, {
      headers: {
        Authorization: getAccessToken(),
      },
    });
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
 * A generic HTTP GET Request
 * @param url The URL of the resource.
 * @returns A Promise<Response> with the response from the API.
 */
export const httpGETRequestPromise = (url: string) => {
  return fetch(url, {
    headers: {
      Authorization: getAccessToken(),
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
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAccessToken(),
    },
    body: JSON.stringify(data),
  });
};

/**
 * A generic HTTP PUT Request
 * @param url The URL of the resource.
 * @param data The request payload.
 * @returns A Promise<Response> with the response from the API.
 */
export const httpPUTRequest = (url: string, data: any) => {
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAccessToken(),
    },
    body: JSON.stringify(data),
  });
};

/**
 * HTTP Delete Request
 * @param url The URL containing the resource id to be deleted.
 * @returns A Promise<Response> with the response from the API.
 */
export const httpDELETERequest = (url: string) => {
  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: getAccessToken(),
    },
  });
};
