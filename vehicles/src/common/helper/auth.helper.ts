import { ForbiddenException } from '@nestjs/common';
import { Directory } from '../enum/directory.enum';
import { IDP } from '../enum/idp.enum';
import { Role } from '../enum/roles.enum';
import { IUserJWT } from '../interface/user-jwt.interface';
import {
  UserAuthGroup,
  ClientUserAuthGroup,
  IDIRUserAuthGroup,
} from '../enum/user-auth-group.enum';
import { IRole } from '../interface/role.interface';

/**
 * Determines the directory type based on the identity provider of the user.
 *
 * @param {IUserJWT} user - The user object containing the identity provider information.
 * @returns {Directory} The directory associated with the user's identity provider.
 */
export const getDirectory = (user: IUserJWT) => {
  if (user.identity_provider === IDP.IDIR) {
    return Directory.IDIR;
  } else if (user.identity_provider === IDP.BCEID) {
    if (user.bceid_business_guid) {
      return Directory.BBCEID;
    } else {
      return Directory.BCEID;
    }
  } else {
    return Directory.BCSC;
  }
};

/**
 * Type guard to check if an input is an array of type Role.
 *
 * @param {Role[]} obj - The object to be checked.
 * @returns {obj is Role[]} True if obj is an array of Role, false otherwise.
 */
function isRoleArray(obj: Role[]): obj is Role[] {
  return Array.isArray(obj) && obj.every((item) => typeof item === 'string');
}

const isIRole = (permissions: IRole | Role[]): permissions is IRole => {
  const { allowedBCeIDRoles, allowedIdirRoles, claims } = permissions as IRole;
  return (
    Boolean(allowedBCeIDRoles) || Boolean(allowedIdirRoles) || Boolean(claims)
  );
};

/**
 * Evaluates if a user has at least one of the specified roles, belongs to the specified user authorization group, or meets complex role criteria.
 *
 * This method supports two kinds of inputs for role requirements:
 * 1. Simple list of roles (Role[]): It checks if the user holds any role from the specified list. True indicates possession of a required role.
 * 2. Complex role requirements (IRoleNew): For each object defining roles with 'allOf', 'oneOf', and/or 'userAuthGroup', it evaluates:
 *    - If 'userAuthGroup' is defined, the user must belong to it.
 *    - For 'allOf', the user must have all specified roles.
 *    - For 'oneOf', the user must have at least one of the specified roles.
 * If any role object's criteria are met (considering 'userAuthGroup' if defined), it returns true.
 * Throws an error if both 'allOf' and 'oneOf' are defined in a role object.
 *
 * @param {Role[] | IRole} permissions - An array of roles or role requirement objects to be matched against the user's roles.
 * @param {Role[]} userRoles - An array of roles assigned to the user.
 * @param {UserAuthGroup} userAuthGroup - Optional. The user authorization group to which the user belongs.
 * @returns {boolean} Returns true if the user meets any of the defined role criteria or belongs to the specified user authorization group; false otherwise.
 */
export const matchRoles = (
  permissions: Role[] | IRole,
  userRoles: Role[],
  userAuthGroup?: UserAuthGroup,
) => {
  if (!userAuthGroup) return false;
  if (isIRole(permissions)) {
    const { allowedIdirRoles, allowedBCeIDRoles, claims } = permissions;
    // If only claims is specified, return the value of that.
    if (claims && !allowedBCeIDRoles && !allowedIdirRoles) {
      return claims.some((role) => userRoles.includes(role));
    }
    let isAllowed: boolean;
    const isIdir = userAuthGroup in IDIRUserAuthGroup;
    if (isIdir) {
      isAllowed = allowedIdirRoles?.includes(
        userAuthGroup as IDIRUserAuthGroup,
      );
    } else {
      isAllowed = allowedBCeIDRoles?.includes(
        userAuthGroup as ClientUserAuthGroup,
      );
    }
    // If claims is specified alongside the allowed roles, include
    // its value in the output.
    if (claims) {
      isAllowed = isAllowed && claims.some((role) => userRoles.includes(role));
    }
    return isAllowed;
  } else if (isRoleArray(permissions)) {
    // Scenario: roles is a simple list of Role objects.
    // This block checks if any of the roles assigned to the user (userRoles)
    // matches at least one of the roles specified in the input list (roles).
    // It returns true if there is a match, indicating the user has at least one of the required roles.
    return permissions?.some((role) => userRoles.includes(role));
  }
  return false;
};

/**
 * Checks if any company from a list of associated companies matches any of the current user's associated companies.
 *
 * @param {number[]} associatedCompanies - An array of company IDs to check against.
 * @param {number[]} currentUserAssociatedCompanies - An array of the current user's associated company IDs.
 * @returns {boolean} True if there is at least one match; otherwise, false.
 */
export const matchCompanies = (
  associatedCompanies: number[],
  currentUserAssociatedCompanies: number[],
) => {
  return associatedCompanies.some((associatedCompany) =>
    currentUserAssociatedCompanies?.includes(associatedCompany),
  );
};

/**
 * Verifies if a user is associated with a given company by ID.
 *
 * @param {number} companyId - The ID of the company to check association with.
 * @param {number[]} userCompanies - An array of company IDs the user is associated with.
 * @returns {boolean} True if the user is associated with the given company; otherwise, false.
 */
export const checkAssociatedCompanies = (
  companyId: number,
  userCompanies: number[],
) => {
  return userCompanies?.includes(companyId);
};

/**
 * Validates if the user is either from the IDIR identity provider or associated with a given set of companies.
 *
 * Throws a ForbiddenException if the user does not meet the criteria:
 * - The user's identity provider is not IDIR, and
 * - The user's company ID is not in the list of provided userCompanies
 *
 * @param {number[]} userCompanies - An array of company IDs to check against the user's company ID.
 * @param {IUserJWT} user - The user object containing the identity provider and company ID.
 * @returns {boolean} Returns true if the user passes the validation checks.
 * @throws {ForbiddenException} Throws ForbiddenException if the user does not meet the required criteria.
 */
export const checkUserCompaniesContext = (
  userCompanies: number[],
  user: IUserJWT,
) => {
  if (
    user.identity_provider !== IDP.IDIR &&
    !checkAssociatedCompanies(user.companyId, userCompanies)
  ) {
    throw new ForbiddenException();
  }

  return true;
};

/**
 * Validates whether the user has the specified roles and is associated with the specified companies.
 * Throws a ForbiddenException if the validation fails according to the following rules:
 * 1. The user must have at least one of the specified roles.
 * 2. If the user has at least one of the specified roles, they must also be associated with one of the specified companies.
 *
 * @param {Role[]} roles - An array of roles that the user is supposed to have.
 * @param {string} userGUID - The unique identifier for the user.
 * @param {number[]} userCompanies - An array of company IDs that the user is supposed to be associated with.
 * @param {IUserJWT} currentUser - The current user's information, including roles and identity provider.
 * @throws {ForbiddenException} Throws ForbiddenException if the user does not meet the role or company association criteria.
 */
export const validateUserCompanyAndRoleContext = (
  roles: Role[],
  userGUID: string,
  userCompanies: number[],
  currentUser: IUserJWT,
) => {
  const rolesExists = matchRoles(roles, currentUser.roles);
  if (!rolesExists && userGUID) {
    throw new ForbiddenException();
  }
  if (
    rolesExists &&
    userGUID &&
    !checkUserCompaniesContext(userCompanies, currentUser)
  ) {
    throw new ForbiddenException();
  }
};

/**
 * Determines if a specified UserAuthGroup value is present within a given enumeration object.
 *
 * @param {UserAuthGroup} value - The UserAuthGroup value to be checked.
 * @param {ReadonlyArray<ClientUserAuthGroup> | ReadonlyArray<IDIRUserAuthGroup>} enumObject - An array of UserAuthGroup values.
 * @returns {boolean} Returns true if the value is present in the enumObject, otherwise false.
 */
export const doesUserHaveAuthGroup = (
  value: UserAuthGroup,
  enumObject: readonly ClientUserAuthGroup[] | readonly IDIRUserAuthGroup[],
): boolean => {
  // This function checks if the given value is present in the enumObject array
  return Object.values(enumObject).includes(value);
};
