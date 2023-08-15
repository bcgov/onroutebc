import { useAddOrbcError } from "../apiManager/hooks";
import { getUserSessionDetailsFromSession } from "../apiManager/httpRequestHandler";
import { OrbcError } from "../types/common";
import { generateErrorCorrelationId } from "./util";

export const logError = (addOrbcError: any, errorTpyeId: string) => {
    const corelationId = generateErrorCorrelationId();
    const userSession = getUserSessionDetailsFromSession();
    const utcTime = new Date().toISOString();
    const orbcError = {
    errorTypeId: errorTpyeId,
    errorOccuredTime: utcTime,
    sessionId: userSession.sid,
    userGuid: userSession.bceid_user_guid,
    corelationId: corelationId,
  } as unknown as OrbcError;
  addOrbcError.mutateAsync({
    ...orbcError
  });

}
  