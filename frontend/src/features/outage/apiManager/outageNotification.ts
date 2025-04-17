import { httpGETRequest } from "../../../common/apiManager/httpRequestHandler";
import { PUBLIC_API_ROUTES } from "./endpoints/endpoints";

export interface OutageNotification {
  title: string;
  message: string;
}

export const getOutageNotification = async (): Promise<OutageNotification> => {
  const url = PUBLIC_API_ROUTES.OUTAGE_NOTIFICATION();
  const response = await httpGETRequest(url);
  return response.data;
};
