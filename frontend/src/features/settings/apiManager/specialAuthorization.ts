import { LOA, LOADetail } from "../types/SpecialAuthorization";
import { LOAFormData } from "../types/LOAFormData";
import { SPECIAL_AUTH_API_ROUTES } from "./endpoints/endpoints";
import { PERMIT_TYPES } from "../../permits/types/PermitType";
import {
  httpDELETERequest,
  // httpGETRequest,
  httpPOSTRequest,
  httpPUTRequest,
} from "../../../common/apiManager/httpRequestHandler";

const activeLOAs = [
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100425",
    startDate: "2023-02-10 00:00:00",
    documentId: 2,
  },
];

const expiredLOAs = [
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  //
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
  },
];

const loaDetails = [
  {
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: 1,
    permitTypes: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    neverExpires: false,
    documentName: "document1.pdf",
    documentSize: 5000000,
    additionalNotes: "This is LOA 100638",
    selectedVehicles: {
      powerUnits: ["74"],
      trailers: ["74"],
    },
  },
  {
    loaNumber: "100425",
    startDate: "2023-02-10 00:00:00",
    documentId: 2,
    permitTypes: [PERMIT_TYPES.TROS],
    neverExpires: true,
    documentName: "document2.pdf",
    documentSize: 4000000,
    additionalNotes: "This is LOA 100425",
    selectedVehicles: {
      powerUnits: ["74"],
      trailers: [],
    },
  },
];

/**
 * Get the LOAs for a given company.
 * @param companyId Company id of the company to get LOAs for
 * @param expired Whether or not to only fetch expired LOAs
 * @returns LOAs for the given company
 */
export const getLOAs = async (
  companyId: number | string,
  expired: boolean,
): Promise<LOA[]> => {
  /*
  const response = await httpGETRequest(
    SPECIAL_AUTH_API_ROUTES.LOA.ALL(companyId, expired),
  );
  return response.data;
  */
  if (expired) {
    return Promise.resolve(expiredLOAs);
  }

  return Promise.resolve(activeLOAs);
};

/**
 * Get the LOA detail for a specific LOA.
 * @param companyId Company id of the company to get LOA for
 * @param loaNumber LOA number of the LOA to fetch
 * @returns LOA detail for a given LOA
 */
export const getLOADetail = async (
  companyId: number | string,
  loaNumber: string,
): Promise<LOADetail> => {
  /*
  const response = await httpGETRequest(
    SPECIAL_AUTH_API_ROUTES.LOA.DETAIL(companyId, loaNumber),
  );
  return response.data;
  */
  const loa = loaDetails.find(l => l.loaNumber === loaNumber);
  if (!loa) throw new Error(`LOA ${loaNumber} not found`);
  return loa;
};

/**
 * Create an LOA for a company.
 * @param LOAData Information about the LOA to be created for the company
 * @returns Result of creating the LOA, or error on fail
 */
export const createLOA = async (
  LOAData: {
    companyId: number | string;
    data: LOAFormData;
  },
) => {
  const { companyId, data } = LOAData;
  return await httpPOSTRequest(
    SPECIAL_AUTH_API_ROUTES.LOA.CREATE(companyId),
    data,
  );
};

/**
 * Update an LOA for a company.
 * @param LOAData Information about the LOA to be updated for the company
 * @returns Result of updating the LOA, or error on fail
 */
export const updateLOA = async (
  LOAData: {
    companyId: number | string;
    loaNumber: string;
    data: LOAFormData;
  },
) => {
  const { companyId, loaNumber, data } = LOAData;
  return await httpPUTRequest(
    SPECIAL_AUTH_API_ROUTES.LOA.UPDATE(companyId, loaNumber),
    data,
  );
};

/**
 * Remove an LOA for a company.
 * @param LOAData LOA number and id of the company to remove it from
 * @returns Result of removing the LOA, or error on fail
 */
export const removeLOA = async (
  LOAData: {
    companyId: number | string;
    loaNumber: string;
  },
) => {
  const { companyId, loaNumber } = LOAData;
  return await httpDELETERequest(
    SPECIAL_AUTH_API_ROUTES.LOA.REMOVE(companyId, loaNumber),
  );
};
