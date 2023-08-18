import { getUserSessionDetailsFromSession } from "../apiManager/httpRequestHandler";
import { OrbcError } from "../types/common";

export const logError = (addOrbcError: any, errorTpyeId: string) => {
    const storedCorrelationId = sessionStorage.getItem('correlationId');
    const userSession = getUserSessionDetailsFromSession();
    const utcTime = new Date().toISOString();
    const orbcError = {
    errorTypeId: errorTpyeId,
    errorOccuredTime: utcTime,
    sessionId: userSession.sid,
    userGuid: userSession.bceid_user_guid,
    corelationId: storedCorrelationId,
  } as unknown as OrbcError;
  addOrbcError.mutateAsync({
    ...orbcError
  });

}
  