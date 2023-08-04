import React, { Dispatch, SetStateAction } from "react";

/**
 * The user details to be set in the context.
 */
export type UserDetailContext = {
  firstName: string;
  lastName: string;
  userName: string;
  phone1: string;
  phone1Extension: string;
  phone2: string;
  phone2Extension: string;
  email: string;
  fax: string;
};
/**
 * The data and functions to in the react context.
 */
export type OnRouteBCContextType = {
  setUserRoles?: Dispatch<SetStateAction<string[] | undefined>>;
  userRoles?: string[];
  setUserDetails?: Dispatch<SetStateAction<UserDetailContext | undefined>>;
  userDetails?: UserDetailContext;
  setCompanyId?: Dispatch<SetStateAction<number | undefined>>;
  companyId?: number;
  setCompanyLegalName?: Dispatch<SetStateAction<string | undefined>>;
  companyLegalName?: string;
};

const defaultBehaviour: OnRouteBCContextType = {};

const OnRouteBCContext =
  React.createContext<OnRouteBCContextType>(defaultBehaviour);

export default OnRouteBCContext;
