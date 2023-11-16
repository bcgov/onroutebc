import { IDPS } from "../common/types/idp";

export const HOME = "/";
export const UNAUTHORIZED = "unauthorized";
export const UNIVERSAL_UNAUTHORIZED = "universal-unauthorized";

// Manage Vehicles
export const MANAGE_VEHICLES = "manage-vehicles";
export const ADD_POWER_UNIT = "add-powerunit";
export const ADD_TRAILER = "add-trailer";

// Manage Profile
export const MANAGE_PROFILES = "manage-profiles";
export const ADD_USER = `/${MANAGE_PROFILES}/add-user`;
export const EDIT_USER = `/${MANAGE_PROFILES}/edit-user`;

// Permits
export const PERMITS = "permits";
export const PERMIT_VOID = "void";
export const PERMIT_AMEND = "amend";

// Applications
export const APPLICATIONS = "applications";
export const APPLICATIONS_SUCCESS = "success";
export const APPLICATIONS_FAILURE = "failure";

// Wizard
export const CREATE_PROFILE = "create-profile";
export const WELCOME = "welcome";
export const USER_INFO = "user-info";

// IDIR
export const IDIR_WELCOME = `/${IDPS.IDIR}/welcome`;
export const SEARCH_RESULTS = `/${IDPS.IDIR}/search-results`;

// Payment
export const PAYMENT_REDIRECT = "payment";
