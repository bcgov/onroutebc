import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";

export const APPLICATIONS_API_BASE = (companyId: string) =>
  `${VEHICLES_URL}/companies/${companyId}/applications`;

const PERMITS_API_BASE = (companyId: string) =>
  `${VEHICLES_URL}/companies/${companyId}/permits`;

const STAFF_PERMIT_API_BASE = `${VEHICLES_URL}/permits`;

const STAFF_APPLICATIONS_API_BASE = `${VEHICLES_URL}/applications`;

export const APPLICATIONS_API_ROUTES = {
  CREATE: (companyId: string) => APPLICATIONS_API_BASE(companyId),
  UPDATE: (companyId: string) => APPLICATIONS_API_BASE(companyId),
  // the endpoint for fetching applications for use in the ApplicationsInReviewList component
  GET: (companyId: string) => APPLICATIONS_API_BASE(companyId),
  DELETE: (companyId: string) => APPLICATIONS_API_BASE(companyId),
};

export const STAFF_APPLICATIONS_API_ROUTES = {
  // the endpoint for fetching applications for use in the ApplicationsInQueueList component
  GET: () => STAFF_APPLICATIONS_API_BASE,
};

export const PERMITS_API_ROUTES = {
  BASE: (companyId: string) => PERMITS_API_BASE(companyId),
  GET: (companyId: string) => PERMITS_API_BASE(companyId),
  ISSUE: (companyId: string) => `${APPLICATIONS_API_BASE(companyId)}/issue`,
  AMEND: APPLICATIONS_API_ROUTES.CREATE,
  DOWNLOAD: (companyId: string, permitId: string) =>
    `${PERMITS_API_BASE(companyId)}/${permitId}/document`,
  RECEIPT: (companyId: string, permitId: string) =>
    `${PERMITS_API_BASE(companyId)}/${permitId}/receipt`,
  VOID: (permitId: string) => `${STAFF_PERMIT_API_BASE}/${permitId}/void`,
  RESEND: (permitId: string) =>
    `${STAFF_PERMIT_API_BASE}/${permitId}/notification`,
};

const PAYMENT_API_BASE = `${VEHICLES_URL}/payment`;

export const PAYMENT_API_ROUTES = {
  START: PAYMENT_API_BASE,
  COMPLETE: PAYMENT_API_BASE,
  GET: PAYMENT_API_BASE,
  PAYMENT_GATEWAY: `payment-gateway`,
};

const CART_API_BASE = (companyId: string) =>
  `${VEHICLES_URL}/companies/${companyId}/shopping-cart`;

export const CART_API_ROUTES = {
  GET: (companyId: string, fetchAllApplications?: boolean) => {
    if (typeof fetchAllApplications === "undefined") {
      return CART_API_BASE(companyId);
    }

    return `${CART_API_BASE(companyId)}?allApplications=${Boolean(fetchAllApplications)}`;
  },
  ADD: (companyId: string) => CART_API_BASE(companyId),
  REMOVE: (companyId: string) => CART_API_BASE(companyId),
  COUNT: (companyId: string) => `${CART_API_BASE(companyId)}/count`,
};
