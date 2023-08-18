import React, { Dispatch, SetStateAction } from "react";

/**
 * The user details to be set in the context.
 */
export type IDIRUserDetailContext = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  userAuthGroup: string;
};

/**
 * The user details to be set in the context.
 */
export interface BCeIDUserDetailContext {
  firstName: string;
  lastName: string;
  userName: string;
  phone1: string;
  phone1Extension: string;
  phone2: string;
  phone2Extension: string;
  email: string;
  fax: string;
  userAuthGroup: string;
}

/**
 * The data and functions to in the react context.
 */
export type OnRouteBCContextType = {
  setUserRoles?: Dispatch<SetStateAction<string[] | undefined>>;
  userRoles?: string[];
  setUserDetails?: Dispatch<SetStateAction<BCeIDUserDetailContext | undefined>>;
  userDetails?: BCeIDUserDetailContext;
  setCompanyId?: Dispatch<SetStateAction<number | undefined>>;
  companyId?: number;
  setCompanyLegalName?: Dispatch<SetStateAction<string | undefined>>;
  companyLegalName?: string;
  idirUserDetails?: IDIRUserDetailContext;
  setIDIRUserDetails?: Dispatch<SetStateAction<IDIRUserDetailContext | undefined>>;
};

const defaultBehaviour: OnRouteBCContextType = {};

const OnRouteBCContext =
  React.createContext<OnRouteBCContextType>(defaultBehaviour);

export default OnRouteBCContext;
