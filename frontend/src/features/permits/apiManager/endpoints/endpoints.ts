import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";

export const PERMITS_API = {
  SUBMIT_TERM_OVERSIZE_PERMIT: `${VEHICLES_URL}/permits/applications`,
};

export const APPLICATION_UPDATE_STATUS_API = `${VEHICLES_URL}/permits/applications/status`;

export const APPLICATION_PDF_API = `${VEHICLES_URL}/permits/pdf`;

export const PAYMENT_API = `${VEHICLES_URL}/payment`;
