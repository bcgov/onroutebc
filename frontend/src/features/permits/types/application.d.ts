import { Dayjs } from "dayjs";

import { PermitStatus, PERMIT_STATUSES } from "./PermitStatus";
import { PermitType } from "./PermitType";
import { ReplaceDayjsWithString } from "./utility";

export const PERMIT_APPLICATION_ORIGINS = {
  ONLINE: "ONLINE",
  PPC: "PPC",
} as const;

export type PermitApplicationOrigin = typeof PERMIT_APPLICATION_ORIGINS[keyof typeof PERMIT_APPLICATION_ORIGINS];

export const PERMIT_APPROVAL_SOURCES = {
  AUTO: "AUTO",
  PPC: "PPC",
  TPS: "TPS",
} as const;

export type PermitApprovalSource = typeof PERMIT_APPROVAL_SOURCES[keyof typeof PERMIT_APPROVAL_SOURCES];

/**
 * A base permit type. This is an incomplete object and meant to be extended for use.
 */
export interface Application {
  permitId?: string;
  originalPermitId?: string;
  comment?: string | null;
  permitStatus?: PermitStatus;
  companyId: number;
  userGuid?: string | null;
  permitType: PermitType;
  applicationNumber?: string;
  permitNumber?: string;
  permitApplicationOrigin?: PermitApplicationOrigin;
  permitApprovalSource?: PermitApprovalSource;
  revision?: number | null;
  previousRevision?: string | null;
  createdDateTime?: Dayjs;
  updatedDateTime?: Dayjs;
  permitData: TermOversizeApplication;
  documentId?: string;
}

/**
 * Type that replaces all Dayjs types inside direct TermOversizeApplication entries to string types
 * 
 * eg. TermOversizeApplication = { c?: Dayjs }, 
 * 
 * and T = { a: number, b: TermOversizeApplication },
 * 
 * then TransformPermitData = { a: number, b: { c?: string } }
 */
type TransformPermitData<T> = {
  [K in keyof T]: T[K] extends TermOversizeApplication ? ReplaceDayjsWithString<TermOversizeApplication> : T[K];
};

// These two types are used to transform an application data response object (with strings as date fields) to Application type (with Dayjs as date fields)
// and vice versa (Application type to application data request data object with strings as date fields)
export type ApplicationResponse = TransformPermitData<ReplaceDayjsWithString<Application>>;
export type ApplicationRequestData = TransformPermitData<ReplaceDayjsWithString<Application>>;

export interface MailingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  provinceCode: string;
  countryCode: string;
  postalCode: string;
}

export interface ContactDetails {
  firstName: string;
  lastName: string;
  phone1: string;
  phone1Extension?: string;
  phone2?: string;
  phone2Extension?: string;
  email: string;
  fax?: string;
}

export interface VehicleDetails {
  vin: string;
  plate: string;
  make: string;
  year: number | null;
  countryCode: string;
  provinceCode: string;
  vehicleType: string;
  vehicleSubType: string;
  saveVehicle?: boolean;
  unitNumber?: string;
}

export interface Commodities {
  description: string;
  condition: string;
  conditionLink: string;
  checked: boolean;
  disabled?: boolean;
}

export interface TermOversizeApplication {
  startDate: Dayjs;
  permitDuration: number; //days
  expiryDate: Dayjs;
  contactDetails?: ContactDetails;
  vehicleDetails?: VehicleDetails;
  commodities: Commodities[];
  mailingAddress: MailingAddress;
  feeSummary?: string;
  companyName: string;
  clientNumber: string;
}

export interface PermitApplicationInProgress {
  applicationNumber: string;
  companyId: number;
  createdDateTime: string;
  permitApplicationOrigin?: PermitApplicationOrigin | null;
  permitApprovalSource?: PermitApprovalSource | null;
  permitData: ReplaceDayjsWithString<TermOversizeApplication>;
  permitId: string
  permitNumber?: string | null;
  permitStatus: typeof PERMIT_STATUSES.IN_PROGRESS;
  permitType: PermitType;
  updatedDateTime: string;
  userGuid: string;
  documentId?: string | null;
}

export type ApplicationInProgress = PermitApplicationInProgress;
