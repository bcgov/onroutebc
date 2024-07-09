import {
  IDIR_USER_AUTH_GROUP,
  ROLES,
  UserAuthGroupType,
  UserRolesType,
} from "./types";

const { SYSTEM_ADMINISTRATOR, CTPO, PPC_CLERK, FINANCE, ENFORCEMENT_OFFICER, HQ_ADMINISTRATOR } =
  IDIR_USER_AUTH_GROUP;

const ALL_IDIR_GROUPS = Object.values(IDIR_USER_AUTH_GROUP);

export type Definition = {
  /**
   * The auth groups that are disallowed from seeing the component.
   *
   * Given first preference if specified. If the user has one of
   * the specified auth groups, the component WILL NOT render.
   *
   * Example use-case: `ORBC_READ_PERMIT` is a role that's available to
   * the `FINANCE` users but they aren't allowed privileges to see
   * Applications in Progress.
   * In this instance, `disallowedAuthGroups = ['FINANCE']`.
   */
  disallowedAuthGroups?: UserAuthGroupType[];
  /**
   * The only role to check against.
   *
   * If the user has the specified role, the component will render.
   * Given second preference.
   *
   * Only one of `allowedRole` or `allowedAuthGroups` is expected.
   * If both `allowedRole` and `allowedAuthGroups` are specified,
   * `allowedAuthGroups` will be ignored.
   */
  allowedRole?: UserRolesType;
  /**
   * The only role to check against.
   *
   * If the user has the specified auth group, the component will render.
   *
   * Given last preference.
   *
   * Only used if `allowedRole` is not given.
   */
  allowedAuthGroups?: UserAuthGroupType[];
};

type DefinitionObjectType = { [key: string]: Definition };

/**
 * All the permissions in the file are directly based off of the confluence page.
 * @link https://confluence.th.gov.bc.ca/x/kwY3C
 */

export const CompanyProfilePermissions: Definition = {};

export const MANAGE_VEHICLE_INVENTORY: DefinitionObjectType = {
  VIEW_VEHICLE_INVENTORY_SCREEN: {
    disallowedAuthGroups: [FINANCE, ENFORCEMENT_OFFICER, HQ_ADMINISTRATOR],
    allowedRole: ROLES.READ_VEHICLE,
  },

  ADD_VEHICLE: {
    disallowedAuthGroups: [FINANCE, ENFORCEMENT_OFFICER, HQ_ADMINISTRATOR],
    allowedRole: ROLES.WRITE_VEHICLE,
  },

  // Power Unit tab
  VIEW_LIST_OF_POWER_UNITS: {
    disallowedAuthGroups: [FINANCE, ENFORCEMENT_OFFICER, HQ_ADMINISTRATOR],
    allowedRole: ROLES.READ_VEHICLE,
  },
  UPDATE_POWER_UNIT: {
    disallowedAuthGroups: [FINANCE, ENFORCEMENT_OFFICER, HQ_ADMINISTRATOR],
    allowedRole: ROLES.WRITE_VEHICLE,
  },
  DELETE_POWER_UNIT: {
    disallowedAuthGroups: [FINANCE, ENFORCEMENT_OFFICER, HQ_ADMINISTRATOR],
    allowedRole: ROLES.WRITE_VEHICLE,
  },

  // Trailer tab
  VIEW_LIST_OF_TRAILERS: {
    disallowedAuthGroups: [FINANCE, ENFORCEMENT_OFFICER, HQ_ADMINISTRATOR],
    allowedRole: ROLES.READ_VEHICLE,
  },
  UPDATE_TRAILER: {
    disallowedAuthGroups: [FINANCE, ENFORCEMENT_OFFICER, HQ_ADMINISTRATOR],
    allowedRole: ROLES.WRITE_VEHICLE,
  },
  DELETE_TRAILER: {
    disallowedAuthGroups: [FINANCE, ENFORCEMENT_OFFICER, HQ_ADMINISTRATOR],
    allowedRole: ROLES.WRITE_VEHICLE,
  },
};

export const GLOBAL_SEARCH: DefinitionObjectType = {
  VIEW_GLOBAL_SEARCH_SCREEN: {
    allowedAuthGroups: ALL_IDIR_GROUPS,
  },

  SEARCH_FOR_VEHICLE: {

  },
  SEARCH_FOR_COMPANY: {
    allowedAuthGroups: ALL_IDIR_GROUPS
  },
  DELETE_COMPANY: {
    allowedAuthGroups: [SYSTEM_ADMINISTRATOR]
  },
  MERGE_COMPANY: {
    allowedAuthGroups: [SYSTEM_ADMINISTRATOR]
  },
  CREATE_COMPANY: {
    allowedAuthGroups: [SYSTEM_ADMINISTRATOR]
  }
};

export const MISCELLANEOUS: DefinitionObjectType = {
  VIEW_SHOPPING_CART: {
    allowedAuthGroups: [PPC_CLERK, CTPO],
    disallowedAuthGroups: [FINANCE, ENFORCEMENT_OFFICER, HQ_ADMINISTRATOR],
  },
  /**
   * sees own created applications
   * sees applications from whole company
   * sees IDIR-created applications
   */
};
