import { httpPOSTRequest } from "../../../common/apiManager/httpRequestHandler";
import { removeEmptyValues } from "../../../common/helpers/util";
import { PERMITS_API } from "./endpoints/endpoints";

export const submitTermOversize = (
  termOversizePermit: any
): Promise<Response> => {
  return httpPOSTRequest(
    PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT,
    removeEmptyValues(termOversizePermit)
  );
};
