import { IDPS } from "../common/types/idp";

export const HOME = "/";

export const ERROR_ROUTES = {
  UNAUTHORIZED: "/unauthorized",
  UNIVERSAL_UNAUTHORIZED: "/universal-unauthorized",
};

// Manage Vehicles
const VEHICLES_ROUTE_BASE = "/manage-vehicles";
export const VEHICLES_ROUTES = {
  MANAGE: VEHICLES_ROUTE_BASE,
  ADD_POWER_UNIT: `${VEHICLES_ROUTE_BASE}/add-powerunit`,
  ADD_TRAILER: `${VEHICLES_ROUTE_BASE}/add-trailer`,
  TRAILER_TAB: `${VEHICLES_ROUTE_BASE}#trailer`,
  POWER_UNIT_DETAILS: `${VEHICLES_ROUTE_BASE}/power-units`,
  TRAILER_DETAILS: `${VEHICLES_ROUTE_BASE}/trailers`,
};

// Manage Profile
const PROFILE_ROUTE_BASE = "/manage-profiles";
export const PROFILE_ROUTES = {
  MANAGE: PROFILE_ROUTE_BASE,
  ADD_USER: `${PROFILE_ROUTE_BASE}/add-user`,
  EDIT_USER: `${PROFILE_ROUTE_BASE}/edit-user`,
  USER_INFO: "/user-info",
};

// Permits
const PERMITS_ROUTE_BASE = "/permits";
export const PERMITS_ROUTES = {
  BASE: PERMITS_ROUTE_BASE,
  VOID: "void",
  AMEND: "amend",
};

// Applications
const APPLICATIONS_ROUTE_BASE = `/applications`;
export const APPLICATIONS_ROUTES = {
  BASE: APPLICATIONS_ROUTE_BASE,
  START_APPLICATION: `${APPLICATIONS_ROUTE_BASE}/permits`,
  SUCCESS: `${APPLICATIONS_ROUTE_BASE}/success`,
  FAILURE: `${APPLICATIONS_ROUTE_BASE}/failure`,
};

// Create Profile Wizard
export const CREATE_PROFILE_WIZARD_ROUTES = {
  CREATE: "/create-profile",
  WELCOME: "/welcome",
};

// IDIR
const IDIR_ROUTE_BASE = `/${IDPS.IDIR}`;
export const IDIR_ROUTES = {
  WELCOME: `${IDIR_ROUTE_BASE}/welcome`,
  SEARCH_RESULTS: `${IDIR_ROUTE_BASE}/search-results`,
};

// Payment
const PAYMENT_ROUTE_BASE = "/payment";
export const PAYMENT_ROUTES = {
  BASE: PAYMENT_ROUTE_BASE,
  PAYMENT_REDIRECT: PAYMENT_ROUTE_BASE,
};
