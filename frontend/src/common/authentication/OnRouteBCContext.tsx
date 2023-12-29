import React, { Dispatch, SetStateAction } from "react";
import { IDIRUserAuthGroupType, MigratedClient } from "./types";

import { Nullable, Optional } from "../types/common";

/**
 * The user details to be set in the context.
 */
export type IDIRUserDetailContext = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  userAuthGroup: IDIRUserAuthGroupType;
};

/**
 * The user details to be set in the context.
 */
export interface BCeIDUserDetailContext {
  firstName: string;
  lastName: string;
  userName: string;
  phone1: string;
  phone1Extension?: string;
  phone2?: string;
  phone2Extension?: string;
  email: string;
  fax?: string;
  userAuthGroup: string;
}

/**
 * The data and functions to in the react context.
 */
export type OnRouteBCContextType = {
  setUserRoles?: Dispatch<SetStateAction<Nullable<string[]>>>;
  userRoles?: Nullable<string[]>;
  setOnRouteBCClientNumber?: Dispatch<SetStateAction<Optional<string>>>;
  onRouteBCClientNumber?: string;
  setUserDetails?: Dispatch<SetStateAction<Optional<BCeIDUserDetailContext>>>;
  userDetails?: BCeIDUserDetailContext;
  setCompanyId?: Dispatch<SetStateAction<Optional<number>>>;
  companyId?: number;
  setCompanyLegalName?: Dispatch<SetStateAction<Optional<string>>>;
  companyLegalName?: string;
  idirUserDetails?: IDIRUserDetailContext;
  setIDIRUserDetails?: Dispatch<
    SetStateAction<Optional<IDIRUserDetailContext>>
  >;
  setMigratedClient?: Dispatch<SetStateAction<Optional<MigratedClient>>>;
  migratedClient?: MigratedClient;
};

const defaultBehaviour: OnRouteBCContextType = {};

const OnRouteBCContext =
  React.createContext<OnRouteBCContextType>(defaultBehaviour);

export default OnRouteBCContext;
