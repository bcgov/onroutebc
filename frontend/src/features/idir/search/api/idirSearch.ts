import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import { httpGETRequest } from "../../../../common/apiManager/httpRequestHandler";
import {
  PaginatedResponse,
  PaginationOptions,
} from "../../../../common/types/common";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { Permit } from "../../../permits/types/permit";
import { SearchFields } from "../types/types";

/**
 * Searches the data with options and value entered by the user.
 * @param SearchFields The search parameters.
 * @returns The response from the API.
 */
export const getPermitDataBySearch = (
  { searchEntity, searchByFilter, searchString }: SearchFields,
  { page = 0, take = 10 }: PaginationOptions,
): Promise<PaginatedResponse<Permit>> => {
  const searchURL = new URL(`${VEHICLES_URL}/${searchEntity}`);
  searchURL.searchParams.set("searchColumn", searchByFilter);
  searchURL.searchParams.set("searchString", searchString);

  // API pagination index starts at 1. Hence page + 1.
  searchURL.searchParams.set("page", (page + 1).toString());
  searchURL.searchParams.set("take", take.toString());
  return httpGETRequest(searchURL.toString())//.then((response) => response.data);
  .then((response) => {
    console.log(response.data); // Log the response.data
    return response.data; // Return the response.data
  })

};

/**
 * Searches the data with options and value entered by the user.
 * @param SearchFields The search parameters.
 * @returns The response from the API.
 */
export const getCompanyDataBySearch = (
  { searchEntity, searchByFilter, searchString }: SearchFields,
  { page = 0, take = 10 }: PaginationOptions,
): Promise<PaginatedResponse<CompanyProfile>> => {
  const searchURL = new URL(`${VEHICLES_URL}/${searchEntity}`);
  if (searchByFilter === "companyName") {
    searchURL.searchParams.set("companyName", searchString);
  } else {
    searchURL.searchParams.set("clientNumber", searchString);
  }
  // API pagination index starts at 1. Hence page + 1.
  searchURL.searchParams.set("page", (page + 1).toString());
  searchURL.searchParams.set("take", take.toString());
  return httpGETRequest(searchURL.toString()).then((response) => response.data);
};

/**
 * Searches the data with options and value entered by the user.
 * @param SearchFields The search parameters.
 * @returns The response from the API.
 */
export const getApplicationDataBySearch = (
  { searchEntity, searchByFilter, searchString }: SearchFields,
  { page = 0, take = 10 }: PaginationOptions,
): Promise<PaginatedResponse<Permit>> => {
  const searchURL = new URL(`${VEHICLES_URL}/${searchEntity}`);
  console.log('test search url: ' + searchURL);
  searchURL.searchParams.set("searchColumn", searchByFilter);
  searchURL.searchParams.set("searchString", searchString);

  // API pagination index starts at 1. Hence page + 1.
  searchURL.searchParams.set("page", (page + 1).toString());
  searchURL.searchParams.set("take", take.toString());
  // return httpGETRequest(searchURL.toString()).then((response) => response.data);

  return httpGETRequest(searchURL.toString().replace('application', 'permit').replace('applicationNumber', 'permitNumber'))
  .then((response) => {
    
    response.data = {
      // Test mock data
      "items": [
          {
              "companyId": 74,
              "permitId": "1",
              "originalPermitId": "1",
              "revision": 0,
              "previousRevision": null,
              "comment": null,
              "permitType": "TROS",
              "applicationNumber": "A2-00010000-566-A00",
              "permitNumber": "1111",
              "permitStatus": "PAYMENT_COMPLETE",
              "permitApprovalSource": null,
              "permitApplicationOrigin": "ONLINE",
              "permitIssueDateTime": null,
              "createdDateTime": "2024-02-14T21:40:20.383Z",
              "updatedDateTime": "2024-02-14T21:41:00.528Z",
              "documentId": null,
              "permitData": {
                  "companyName": "Parisian LLC Trucking",
                  "clientNumber": "B3-000005-722",
                  "startDate": "2024-02-14",
                  "permitDuration": 30,
                  "expiryDate": "2024-03-14",
                  "commodities": [
                      {
                          "description": "General Permit Conditions",
                          "condition": "CVSE-1000",
                          "conditionLink": "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251",
                          "checked": true,
                          "disabled": true
                      },
                      {
                          "description": "Permit Scope and Limitation",
                          "condition": "CVSE-1070",
                          "conditionLink": "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1261",
                          "checked": true,
                          "disabled": true
                      }
                  ],
                  "contactDetails": {
                      "firstName": "Red",
                      "lastName": "Stevenson",
                      "phone1": "778-555-2907",
                      "phone1Extension": null,
                      "phone2": "778-555-2447",
                      "phone2Extension": null,
                      "email": "red.stevenson@ewingtransport.ca",
                      "additionalEmail": null,
                      "fax": "778-555-7727"
                  },
                  "mailingAddress": {
                      "addressLine1": "415 Schiller Road",
                      "addressLine2": null,
                      "city": "Ballylinan",
                      "provinceCode": "BC",
                      "countryCode": "CA",
                      "postalCode": "B4P 1O2"
                  },
                  "vehicleDetails": {
                      "vehicleId": "74",
                      "unitNumber": "61",
                      "vin": "275393",
                      "plate": "PRJZZP",
                      "make": "Freightliner",
                      "year": 2001,
                      "countryCode": "CA",
                      "provinceCode": "BC",
                      "vehicleType": "powerUnit",
                      "vehicleSubType": "TOWVEHC",
                      "saveVehicle": false
                  },
                  "feeSummary": "30"
              }
          }
      ],
      // Test empty data
      // "items": [

      // ],
      "meta": {
          "page": 1,
          "take": 10,
          "totalItems": 1,
          "pageCount": 1,
          "hasPreviousPage": false,
          "hasNextPage": false
      }
  };
    
    console.log(response.data);
    return response.data;

  })
  .catch((error) => {
    console.error(error);
  });
};
