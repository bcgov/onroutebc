import { httpPOSTRequest } from "../../../common/apiManager/httpRequestHandler";
import { TermOversizePermit } from "../types/permits";
import { PERMITS_API } from "./endpoints/endpoints";

export const submitTermOversize = (
  termOversizePermit: TermOversizePermit
): Promise<Response> => {
  return httpPOSTRequest(
    PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT,
    termOversizePermit
  );
};
