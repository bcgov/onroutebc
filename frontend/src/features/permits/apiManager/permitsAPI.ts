import { AxiosResponse } from "axios";
import {
  httpPOSTRequest_axios,
  httpPUTRequest_axios,
} from "../../../common/apiManager/httpRequestHandler";
import { replaceEmptyValuesWithNull } from "../../../common/helpers/util";
import { Application } from "../types/application";
import { PERMITS_API } from "./endpoints/endpoints";

export const submitTermOversize = (
  termOversizePermit: Application
): Promise<AxiosResponse> => {
  return httpPOSTRequest_axios(
    PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT,
    replaceEmptyValuesWithNull(termOversizePermit)
  );
};

export const updateTermOversize = (
  termOversizePermit: Application,
  applicationNumber: string
): Promise<AxiosResponse> => {
  return httpPUTRequest_axios(
    `${PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT}/${applicationNumber}`,
    replaceEmptyValuesWithNull(termOversizePermit)
  );
};
