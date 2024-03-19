import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
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
 * @param {Role[] | IRole[]} obj - The object to be checked.
 * @returns {obj is Role[]} True if obj is an array of Role, false otherwise.
 */
function isRoleArray(obj: Role[] | IRole[]): obj is Role[] {
  return Array.isArray(obj) && obj.every((item) => typeof item === 'string');
}

/**
 * Evaluates if a user has at least one of the specified roles or meets complex role criteria.
 *
 * This method supports two kinds of inputs for role requirements:
 * 1. Simple list of roles (Role[]): In this case, it checks if any of the roles assigned to the user matches at least one of
 *    the roles specified in the 'roles' parameter. It returns true if there's a match, indicating the user has one of the necessary roles.
 * 2. Complex role requirements (IRole[]): When 'roles' is an array of objects implementing the IRole interface (meaning it can specify
 *    complex role combinations with 'allOf' and 'oneOf' properties), it evaluates these conditions for each role object. It returns true
 *    if for any role object, either all of the 'allOf' roles or at least one of the 'oneOf' roles are present in the 'userRoles' array.
 *
 * @param {Role[] | IRole[]} roles - An array of roles or role requirement objects to be matched against the user's roles.
 * @param {Role[]} userRoles - An array of roles assigned to the user.
 * @returns {boolean} Returns true if the user has at least one of the required roles or meets the complex role requirements, false otherwise.
 */
export const matchRoles = (roles: Role[] | IRole[], userRoles: Role[]) => {
  if (isRoleArray(roles)) {
    // Scenario: roles is a simple list of Role objects.
    // This block checks if any of the roles assigned to the user (userRoles)
    // matches at least one of the roles specified in the input list (roles).
    // It returns true if there is a match, indicating the user has at least one of the required roles.
    return roles?.some((role) => userRoles.includes(role));
  } else {
    // Scenario: roles is not a simple list, but an object or objects implementing IRole,
    // meaning complex role requirements can be specified.
    // This block checks two conditions for each role object:
    // 1. allOf - every role listed must be included in userRoles.
    // 2. oneOf - at least one of the roles listed must be included in userRoles.
    // It returns true if either condition is met for any role object, indicating the user meets the role requirements.
    return roles.some((roleObject) => {
      if (roleObject.allOf?.length && roleObject.oneOf?.length) {
        throw new InternalServerErrorException(
          'Cannot define both allOf and oneOf at the same time!',
        );
      }
      const allOfMatch = roleObject.allOf?.every((role) =>
        userRoles.includes(role),
      );
      const oneOfMatch = roleObject.oneOf?.some((role) =>
        userRoles.includes(role),
      );
      return oneOfMatch || allOfMatch;
    });
  }
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
  enumObject:
    | ReadonlyArray<ClientUserAuthGroup>
    | ReadonlyArray<IDIRUserAuthGroup>,
): boolean => {
  // This function checks if the given value is present in the enumObject array
  return Object.values(enumObject).includes(value);
};
