import { useContext } from "react";
import {
  BCeID_USER_AUTH_GROUP,
  BCeIDUserAuthGroupType,
  IDIR_USER_AUTH_GROUP,
  IDIRUserAuthGroupType,
  UserAuthGroupType,
} from "./types";
import OnRouteBCContext from "./OnRouteBCContext";
import { useFeatureFlagsQuery } from "../hooks/hooks";

const {
  SYSTEM_ADMINISTRATOR: SA,
  CTPO,
  PPC_CLERK: PC,
  FINANCE: FIN,
  ENFORCEMENT_OFFICER: EO,
  HQ_ADMINISTRATOR: HQA,
} = IDIR_USER_AUTH_GROUP;

const ALL_IDIR_GROUPS = Object.values(IDIR_USER_AUTH_GROUP);
const ALL_BCeID_GROUPS = Object.values(BCeID_USER_AUTH_GROUP);

const { COMPANY_ADMINISTRATOR: CA, PERMIT_APPLICANT: PA } =
  BCeID_USER_AUTH_GROUP;

export type ConfigPartial = {
  /**
   * The idir auth groups that are allowed to see the component.
   *
   * If the user has one of the specified auth groups,
   * the component will render.
   */
  allowedIDIRAuthGroups?: readonly IDIRUserAuthGroupType[];

  /**
   * The bceid auth groups that are allowed to see the component.
   *
   * If the user has one of the specified auth groups,
   * the component will render.
   */
  allowedBCeIDAuthGroups?: readonly BCeIDUserAuthGroupType[];
};

export type PermissionConfigType = {
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
  disallowedAuthGroups?: readonly UserAuthGroupType[];
  /**
   * The idir auth groups that are allowed to see the component.
   *
   * If the user has one of the specified auth groups,
   * the component will render.
   */
  allowedIDIRAuthGroups?: readonly IDIRUserAuthGroupType[];

  /**
   * The bceid auth groups that are allowed to see the component.
   *
   * If the user has one of the specified auth groups,
   * the component will render.
   */
  allowedBCeIDAuthGroups?: readonly BCeIDUserAuthGroupType[];
  /**
   * The feature flag to check if the feature is enabled.
   */
  featureFlag?: string;
  /**
   * An additional function call whose boolean value will be accounted
   * for determining whether to render a component.
   * i.e., this function will get called only if other conditions
   * given in the other input props qualify.
   *
   * @param args Any arguments to be passed.
   * @returns A boolean.
   */
  additionalConditionToCall?: (...args: any) => boolean;
  /**
   * With only condition to check, all other configurations are skipped.
   * i.e., this function will be the only check to decide whether to render
   * a component.
   *
   * Simply put, when provided, this will be the only check.
   *
   * @param args Any arguments to be passed.
   * @returns A boolean.
   */
  onlyConditionToCheck?: (...args: any) => boolean;
};

/**
 * All the permissions in the file are directly based off of the confluence page.
 * @link https://confluence.th.gov.bc.ca/x/kwY3C
 *
 * @description All the keys and comments are identical to the feature keys used
 * in the permissions matrix document so that cross-verifying is easy.
 *
 * Note that this is a general structure for as specified in the document.
 * Individual features may need custom checks based on data or API calls
 * and they are not in scope for this implementation.
 */
export const MANAGE_VEHICLE_INVENTORY = {
  VIEW_VEHICLE_INVENTORY_SCREEN: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  ADD_VEHICLE: {
    allowedBCeIDAuthGroups: [CA, PA],
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  /**
   * Power Unit tab
   */
  VIEW_LIST_OF_POWER_UNITS: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  UPDATE_POWER_UNIT: {
    allowedBCeIDAuthGroups: [CA, PA],
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  DELETE_POWER_UNIT: {
    allowedBCeIDAuthGroups: [CA, PA],
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  /**
   * Trailer tab
   */
  VIEW_LIST_OF_TRAILERS: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  UPDATE_TRAILER: {
    allowedBCeIDAuthGroups: [CA, PA],
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  DELETE_TRAILER: {
    allowedBCeIDAuthGroups: [CA, PA],
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  /**
   * For future implementation
   */
  VEHICLE_CONFIGURATION_TAB: {},
} as const;

export const MANAGE_PERMITS = {
  VIEW_PERMITS_SCREEN: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, FIN, CTPO, HQA],
  },
  START_APPLICATION: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  /**
   * Applications in Progress tab
   */
  VIEW_LIST_OF_APPLICATIONS_IN_PROGRESS: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  VIEW_INDIVIDUAL_APPLICATION_IN_PROGRESS_DETAILS: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  EDIT_INDIVIDUAL_APPLICATION_IN_PROGRESS_DETAILS: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  CANCEL_APPLICATION_IN_PROGRESS: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  /**
   * Applications in Review tab
   */
  VIEW_LIST_OF_APPLICATIONS_IN_REVIEW: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  VIEW_INDIVIDUAL_APPLICATION_IN_REVIEW_DETAILS: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  WITHDRAW_APPLICATION_IN_REVIEW: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  /**
   * Active Permits tab
   */
  VIEW_ACTIVE_PERMITS: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, FIN, CTPO, HQA],
  },
  VIEW_INDIVIDUAL_ACTIVE_PERMIT_PDF: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: ALL_IDIR_GROUPS,
  },
  VIEW_PERMIT_RECEIPT: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: ALL_IDIR_GROUPS,
  },
  REQUEST_PERMIT_AMENDMENT: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  /**
   * Expired Permits tab
   */
  VIEW_LIST_OF_EXPIRED_PERMITS: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: [PC, SA, FIN, CTPO, HQA],
  },
  VIEW_INDIVIDUAL_EXPIRED_PERMIT_PDF: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: ALL_IDIR_GROUPS,
  },
  VIEW_EXPIRED_PERMIT_RECEIPT: {
    allowedBCeIDAuthGroups: ALL_BCeID_GROUPS,
    allowedIDIRAuthGroups: ALL_IDIR_GROUPS,
  },
} as const;
// export type MANAGE_PERMITS_KEYS = keyof typeof MANAGE_PERMITS;
export const MANAGE_PROFILE = {
  /**
   * Company Information tab
   */
  VIEW_COMPANY_INFORMATION: {
    allowedBCeIDAuthGroups: [CA],
    allowedIDIRAuthGroups: [PC, SA, FIN, CTPO, HQA],
  },
  EDIT_COMPANY_INFORMATION: {
    allowedBCeIDAuthGroups: [CA],
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  /**
   * My Information tab
   */
  VIEW_MY_INFORMATION: {
    allowedBCeIDAuthGroups: [CA, PA],
    allowedIDIRAuthGroups: [],
  },
  EDIT_MY_INFORMATION: {
    allowedBCeIDAuthGroups: [CA, PA],
    allowedIDIRAuthGroups: [],
  },
  /**
   * User Management tab
   */
  VIEW_USER_MANAGEMENT_SCREEN: {
    allowedBCeIDAuthGroups: [CA],
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  ADD_USER: {
    allowedBCeIDAuthGroups: [CA],
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  REMOVE_USER: {
    allowedBCeIDAuthGroups: [CA],
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  EDIT_USER: {
    allowedBCeIDAuthGroups: [CA],
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  /**
   * Special Authorization tab
   */
  VIEW_SPECIAL_AUTHORIZATIONS: {
    allowedBCeIDAuthGroups: [CA, PA],
    allowedIDIRAuthGroups: [],
  },
  VIEW_LOA: {
    allowedBCeIDAuthGroups: [CA, PA],
    allowedIDIRAuthGroups: [],
  },
} as const;

export const MANAGE_SETTINGS = {
  /**
   * Special Authorizations Tab
   */
  VIEW_SPECIAL_AUTHORIZATIONS: { allowedIDIRAuthGroups: ALL_IDIR_GROUPS },
  ADD_NO_FEE_FLAG: { allowedIDIRAuthGroups: [SA, FIN, HQA] },
  UPDATE_NO_FEE_FLAG: { allowedIDIRAuthGroups: [SA, FIN, HQA] },
  ADD_LCV_FLAG: { allowedIDIRAuthGroups: [HQA] },
  REMOVE_LCV_FLAG: { allowedIDIRAuthGroups: [HQA] },
  ADD_AN_LOA: { allowedIDIRAuthGroups: [SA, HQA] },
  EDIT_AN_LOA: { allowedIDIRAuthGroups: [SA, HQA] },
  VIEW_LOA: { allowedIDIRAuthGroups: [PC, SA, CTPO, EO, HQA] },
  REMOVE_LOA: { allowedIDIRAuthGroups: [SA, HQA] },

  /**
   * Credit Account Tab
   */
  VIEW_CREDIT_ACCOUNT_TAB: {
    allowedBCeIDAuthGroups: [CA],
    allowedIDIRAuthGroups: [PC, SA, FIN, CTPO],
    featureFlag: "CREDIT-ACCOUNT",
  },
  VIEW_CREDIT_ACCOUNT_DETAILS: {
    allowedBCeIDAuthGroups: [CA],
    allowedIDIRAuthGroups: [SA, FIN],
  },
  UPDATE_CREDIT_ACCOUNT_DETAILS: { allowedIDIRAuthGroups: [FIN] },

  /**
   * Suspend tab
   */
  VIEW_SUSPEND_COMPANY_INFO: {
    allowedIDIRAuthGroups: [SA, FIN, CTPO, EO],
  },
  UPDATE_SUSPEND_COMPANY_FLAG: {
    allowedIDIRAuthGroups: [SA, FIN, CTPO],
  },
} as const;

export const MANAGE_PPC_USERS = {
  VIEW_MANAGE_PPC_USERS_SCREEN: { allowedIDIRAuthGroups: [SA] },
  UPDATE_PPC_USER_ROLE: { allowedIDIRAuthGroups: [SA] },
  REMOVE_PPC_USER: { allowedIDIRAuthGroups: [SA] },
  MANAGE_PPC_USERS_BUTTON: { allowedIDIRAuthGroups: [SA] },
} as const;

export const REPORTS = {
  PAYMENT_AND_REFUND_SUMMARY_REPORT: {
    allowedIDIRAuthGroups: [PC, SA, FIN, CTPO, HQA],
  },
  PAYMENT_AND_REFUND_DETAIL_REPORT: {
    allowedIDIRAuthGroups: [PC, SA, FIN, CTPO, HQA],
  },
  /**
   * There are some nuances with the permissions:
   * - Permit clerks can only run for their own user;
   * - SA/FIN/HQA can run for all users
   *
   * These are data-oriented filters that only the implementing component
   * takes care of. It cannot be sufficiently designed for here.
   */
} as const;

export const GLOBAL_SEARCH = {
  VIEW_GLOBAL_SEARCH_SCREEN: {
    allowedIDIRAuthGroups: ALL_IDIR_GROUPS,
  },
  SEARCH_FOR_VEHICLE: {
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  SEARCH_FOR_COMPANY: {
    allowedIDIRAuthGroups: ALL_IDIR_GROUPS,
  },
  DELETE_COMPANY: {
    allowedIDIRAuthGroups: [SA],
  },
  MERGE_COMPANY: {
    allowedIDIRAuthGroups: [SA],
  },
  CREATE_COMPANY: {
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  /** Search for Active Permit */
  SEARCH_FOR_ACTIVE_PERMIT: {
    allowedIDIRAuthGroups: ALL_IDIR_GROUPS,
  },
  AMEND_PERMIT: { allowedIDIRAuthGroups: [PC, SA, CTPO] },
  VOID_PERMIT: { allowedIDIRAuthGroups: [SA] },
  REVOKE_PERMIT: { allowedIDIRAuthGroups: [SA] },
  RESEND: { allowedIDIRAuthGroups: [PC, SA, FIN, CTPO, HQA] },

  /** Search for Inactive Permit */
  SEARCH_FOR_INACTIVE_PERMIT: { allowedIDIRAuthGroups: [PC, SA, CTPO, EO] },
  SEARCH_FOR_APPLICATION: { allowedIDIRAuthGroups: [PC, SA, CTPO] },
} as const;

/**
 * Application review queue on staff home screen
 */
export const STAFF_HOME_SCREEN = {
  VIEW_QUEUE: { allowedIDIRAuthGroups: [PC, SA] },
  MANAGE_QUEUE: { allowedIDIRAuthGroups: [PC, SA] },
} as const;

export type MISCELLANEOUS_KEYS = "VIEW_SHOPPING_CART";

export const MISCELLANEOUS = {
  VIEW_SHOPPING_CART: {
    allowedBCeIDAuthGroups: [CA, PA],
    allowedIDIRAuthGroups: [PC, SA, CTPO],
  },
  /**
   * The following are already controlled by API.
   * So, frontend needs no implementation for this.
   */
  /**
   * - sees own created applications
   * - sees applications from whole company
   * - sees IDIR-created applications
   */
} as const;

export const PERMISSIONS_MATRIX = {
  MISCELLANEOUS: MISCELLANEOUS,
  MANAGE_PERMITS: MANAGE_PERMITS,
} as const;

export type ALL_FEATURES = keyof typeof PERMISSIONS_MATRIX;

// Working example
type FEATURE_KEYS = keyof typeof PERMISSIONS_MATRIX;
type FUNCTION_KEYS<T extends FEATURE_KEYS> =
  keyof (typeof PERMISSIONS_MATRIX)[T];

const key1: FEATURE_KEYS = "MANAGE_PERMITS";
export const value1: FUNCTION_KEYS<typeof key1> = "VIEW_PERMITS_SCREEN";

//----------------------

/**
 * A hook to manage the permissions matrix for various features and user authentication groups.
 *
 * @param {Object} config - Configuration object for the permission matrix.
 * @param {Function} [config.onlyConditionToCheck] - A custom condition function, if provided this is the only condition checked.
 * @param {string} [config.featureFlag] - Feature flag key to check if the feature is enabled.
 * @param {Function} [config.additionalConditionToCall] - Additional custom condition to call if the basic conditions are met.
 * @param {string[]} [config.allowedIDIRAuthGroups] - List of allowed IDIR authentication groups.
 * @param {string[]} [config.disallowedAuthGroups] - List of disallowed authentication groups.
 * @param {string[]} [config.allowedBCeIDAuthGroups] - List of allowed BCeID authentication groups.
 * @returns {boolean} - Returns whether the current user has the permission.
 */
export const usePermissionMatrix = ({
  onlyConditionToCheck,
  featureFlag,
  additionalConditionToCall,
  allowedIDIRAuthGroups,
  disallowedAuthGroups,
  allowedBCeIDAuthGroups,
}: PermissionConfigType): boolean => {
  const { userDetails, idirUserDetails } = useContext(OnRouteBCContext);
  const { data: featureFlags } = useFeatureFlagsQuery();
  const isIdir = Boolean(idirUserDetails?.userAuthGroup);

  if (featureFlag) {
    if (featureFlags?.[featureFlag] !== "ENABLED") {
      return false;
    }
  }

  // If the onlyConditionToCheck function is given, call that alone and exit.
  if (onlyConditionToCheck) {
    return onlyConditionToCheck();
  }
  let isAllowed = false;
  let currentUserAuthGroup;
  if (isIdir) {
    currentUserAuthGroup = idirUserDetails?.userAuthGroup;
    isAllowed = Boolean(
      currentUserAuthGroup &&
        allowedIDIRAuthGroups?.includes(currentUserAuthGroup),
    );
  } else {
    currentUserAuthGroup = userDetails?.userAuthGroup;
    isAllowed = Boolean(
      currentUserAuthGroup &&
        allowedBCeIDAuthGroups?.includes(currentUserAuthGroup),
    );
  }
  if (disallowedAuthGroups?.length) {
    isAllowed = Boolean(
      currentUserAuthGroup &&
        !disallowedAuthGroups.includes(currentUserAuthGroup),
    );
  }
  if (isAllowed && additionalConditionToCall) {
    isAllowed = isAllowed && additionalConditionToCall();
  }
  return isAllowed;
};

export type PermissionConfigType22 = {
  /**
   * The feature flag to check if the feature is enabled.
   * If provided, it takes the highest priority.
   *
   * If a feature is not enabled,
   * the component WILL NOT render regardless of other conditions.
   */
  featureFlag?: string;
  /**
   * With only condition to check, all input props but `featureFlag`
   * are skipped.
   *
   * This is the second highest priority after `featureFlag`.
   *
   * i.e., this function will be the only check to decide whether to render
   * a component.
   *
   * @param args Any arguments to be passed.
   * @returns A boolean.
   */
  onlyConditionToCheck?: (...args: any) => boolean;
  /**
   * An additional function call whose boolean value will be accounted
   * for determining whether to render a component.
   * i.e., this function will play along with other specifications
   * given in the other input props.
   *
   * @param args Any arguments to be passed.
   * @returns A boolean.
   */
  additionalConditionToCall?: (...args: any) => boolean;
};

// type PermissionMatrixKeysType = {
//   [K in keyof typeof PERMISSIONS_MATRIX]: {
//     featureKey: K;
//     functionKey: keyof (typeof PERMISSIONS_MATRIX)[K];
//   };
// }[keyof typeof PERMISSIONS_MATRIX];

type Filter<T> = {
  [K in keyof T]: {
    /**
     * The name of the feature as defined in the Feature column in the matrix
     * document.
     */
    majorFeatureKey: K;
    /**
     * The name of the function as defined in the Function column in the matrix
     * document.
     */
    functionKey: keyof T[K];
  };
}[keyof T];

type PermissionMatrixKeysType = Filter<typeof PERMISSIONS_MATRIX>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sample = () => {
  usePermissionMatrixNew({
    majorFeatureKey: "MANAGE_PERMITS",
    functionKey: "VIEW_ACTIVE_PERMITS",
  });
};

/**
 * A hook to manage the permissions matrix for various features and user authentication groups.
 *
 * @param {Object} config - Configuration object for the permission matrix.
 * @param {string} [config.featureFlag] - Priority 1: Feature flag key to check if the feature is enabled. 
 * @param {Function} [config.onlyConditionToCheck] - Priority 2: A custom condition function, if provided this is the only condition checked.
 * @param {string} [config.majorFeatureKey] - Priority 3: The major feature that's the primary key in {@link PERMISSIONS_MATRIX}.
 * @param {string} [config.functionKey] - Priority 3: The function that's the nested key in {@link PERMISSIONS_MATRIX}.
 * @param {Function} [config.additionalConditionToCall] - Priority 4: Additional custom condition to call if the basic conditions are met.
 * 
 * @returns {boolean} - Returns whether the current user has the permission.
 */
export const usePermissionMatrixNew = ({
  featureFlag,
  onlyConditionToCheck,
  majorFeatureKey,
  functionKey,
  additionalConditionToCall,
}: PermissionConfigType22 & PermissionMatrixKeysType): boolean => {
  const { allowedBCeIDAuthGroups, allowedIDIRAuthGroups } = (
    PERMISSIONS_MATRIX[majorFeatureKey] as { [key: string]: ConfigPartial }
  )[functionKey];

  const { userDetails, idirUserDetails } = useContext(OnRouteBCContext);
  const { data: featureFlags } = useFeatureFlagsQuery();
  const isIdir = Boolean(idirUserDetails?.userAuthGroup);

  // If featureFlag is given, exit if it is not enabled.
  if (featureFlag) {
    if (featureFlags?.[featureFlag] !== "ENABLED") {
      return false;
    }
  }

  // If the onlyConditionToCheck function is given, call that alone and exit.
  if (onlyConditionToCheck) {
    return onlyConditionToCheck();
  }
  let isAllowed = false;
  let currentUserAuthGroup;
  if (isIdir) {
    currentUserAuthGroup = idirUserDetails?.userAuthGroup;
    isAllowed = Boolean(
      currentUserAuthGroup &&
        allowedIDIRAuthGroups?.includes(currentUserAuthGroup),
    );
  } else {
    currentUserAuthGroup = userDetails?.userAuthGroup;
    isAllowed = Boolean(
      currentUserAuthGroup &&
        allowedBCeIDAuthGroups?.includes(currentUserAuthGroup),
    );
  }
  if (isAllowed && additionalConditionToCall) {
    isAllowed = isAllowed && additionalConditionToCall();
  }
  return isAllowed;
};
