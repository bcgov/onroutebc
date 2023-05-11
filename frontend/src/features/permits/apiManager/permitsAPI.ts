import { AxiosResponse } from "axios";
import {
  httpPOSTRequest_axios,
  httpPUTRequest_axios,
} from "../../../common/apiManager/httpRequestHandler";
import { replaceEmptyValuesWithNull } from "../../../common/helpers/util";
import { TermOversizeApplication } from "../types/application";
import { PERMITS_API } from "./endpoints/endpoints";

export const submitTermOversize = (
  termOversizePermit: any
): Promise<AxiosResponse> => {
  return httpPOSTRequest_axios(
    PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT,
    replaceEmptyValuesWithNull(termOversizePermit)
  );
};

export const updateTermOversize = (
  termOversizePermit: TermOversizeApplication,
  applicationNumber: string
): Promise<AxiosResponse> => {
  return httpPUTRequest_axios(
    `${PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT}/${applicationNumber}`,
    replaceEmptyValuesWithNull(termOversizePermit)
  );
};
