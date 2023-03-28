import { WIZARD_API } from "./endpoints";

/**
 * Retrieve the company and user details post login.
 */
export const getUserDetails = (
  userGUID: string,
  accessToken: string
): Promise<Response> => {
  return fetch(`${WIZARD_API.USER}/${userGUID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

/**
 * Creates a company profile.
 */
export const createCompany = (createCompanyData: CreateCompanyRequest) => {
  return fetch(`${WIZARD_API.COMPANY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createCompanyData),
  });
};

/**
 * Create a user for a company.
 */
export const createUserInfo = (createUserForCompany: Contact) => {
  const companyId = "124";
  return fetch(`${WIZARD_API.COMPANY}/${companyId}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createUserForCompany),
  });
};
