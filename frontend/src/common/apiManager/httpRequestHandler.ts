import { ApiErrorResponse } from "../../types/common";

const TEMP_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

export const httpGETRequest = async (url: URL) => {
  try {
    const response = await fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // prettier-ignore
        "Authorization": `Bearer ${TEMP_TOKEN}`,
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

export const httpPOSTRequest = (url: string, data: any) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // prettier-ignore
      "Authorization": `Bearer ${TEMP_TOKEN}`,
    },
    body: JSON.stringify(data),
  });
};

export const httpPUTRequest = (url: string, data: any) => {
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // prettier-ignore
      "Authorization": `Bearer ${TEMP_TOKEN}`,
    },
    body: JSON.stringify(data),
  });
};
