import { AxiosResponse } from "axios";

import { LOADetail } from "../types/SpecialAuthorization";
import { LOAFormData, serializeLOAFormData } from "../types/LOAFormData";
import { SPECIAL_AUTH_API_ROUTES } from "./endpoints/endpoints";
// import { PERMIT_TYPES } from "../../permits/types/PermitType";
import {
  httpDELETERequest,
  httpGETRequest,
  httpPOSTRequestWithFile,
  httpPUTRequestWithFile,
} from "../../../common/apiManager/httpRequestHandler";

/*
const activeLOAs = [
  {
    loaId: "1",
    loaNumber: "100638",
    companyId: 74,
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "1",
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "2",
    loaNumber: "100425",
    companyId: 74,
    startDate: "2023-02-10 00:00:00",
    documentId: "2",
    loaPermitType: [PERMIT_TYPES.TROS],
    comment: "This is LOA 100425",
    powerUnits: ["74"],
    trailers: [],
  },
];

const expiredLOAs = [
  {
    loaId: "3",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "3",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "4",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "4",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "5",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "5",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "6",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "6",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "7",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "7",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "8",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "8",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "9",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "9",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "10",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "10",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  //
  {
    loaId: "11",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "11",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "12",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "12",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "13",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "13",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "14",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "14",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "15",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "15",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "16",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "16",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "17",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "17",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
  {
    loaId: "18",
    loaNumber: "100638",
    startDate: "2023-02-10 00:00:00",
    expiryDate: "2023-02-10 00:00:00",
    documentId: "18",
    companyId: 74,
    loaPermitType: [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW],
    comment: "This is LOA 100638",
    powerUnits: ["74"],
    trailers: ["74"],
  },
];
*/

/**
 * Get the LOAs for a given company.
 * @param companyId Company id of the company to get LOAs for
 * @param expired Whether or not to only fetch expired LOAs
 * @returns LOAs for the given company
 */
export const getLOAs = async (
  companyId: number | string,
  expired: boolean,
): Promise<LOADetail[]> => {
  const response = await httpGETRequest(
    SPECIAL_AUTH_API_ROUTES.LOA.ALL(companyId, expired),
  );
  return response.data;
  /*
  if (expired) {
    return Promise.resolve(expiredLOAs);
  }

  return Promise.resolve(activeLOAs);
  */
};

/**
 * Get the LOA detail for a specific LOA.
 * @param companyId Company id of the company to get LOA for
 * @param loaId id of the LOA to fetch
 * @returns LOA detail for a given LOA
 */
export const getLOADetail = async (
  companyId: number | string,
  loaId: string,
): Promise<LOADetail> => {
  const response = await httpGETRequest(
    SPECIAL_AUTH_API_ROUTES.LOA.DETAIL(companyId, loaId),
  );
  return response.data;
  /*
  const activeLoa = activeLOAs.find(l => l.loaId === loaId);
  const expiredLoa = expiredLOAs.find(l => l.loaId === loaId);
  if (!activeLoa && !expiredLoa) throw new Error(`LOA ${loaId} not found`);
  return (activeLoa ?? expiredLoa) as LOADetail;
  */
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
): Promise<AxiosResponse<LOADetail>> => {
  const { companyId, data } = LOAData;
  return await httpPOSTRequestWithFile(
    SPECIAL_AUTH_API_ROUTES.LOA.CREATE(companyId),
    serializeLOAFormData(data),
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
    loaId: string;
    data: LOAFormData;
  },
): Promise<AxiosResponse<LOADetail>> => {
  const { companyId, loaId, data } = LOAData;
  return await httpPUTRequestWithFile(
    SPECIAL_AUTH_API_ROUTES.LOA.UPDATE(companyId, loaId),
    serializeLOAFormData(data),
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
    loaId: string;
  },
): Promise<AxiosResponse<LOADetail>> => {
  const { companyId, loaId } = LOAData;
  return await httpDELETERequest(
    SPECIAL_AUTH_API_ROUTES.LOA.REMOVE(companyId, loaId),
  );
};
