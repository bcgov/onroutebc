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
 * A partial permit type that consists of all common fields used for a permit. 
 * This is an incomplete type and meant to be extended for use.
 */
interface PartialApplication {
  permitId?: string;
  originalPermitId?: string;
  comment?: string | null;
  permitStatus: PermitStatus;
  companyId: number;
  userGuid?: string | null;
  permitType: PermitType;
  applicationNumber?: string;
  permitNumber?: string;
  permitApprovalSource?: PermitApprovalSource;
  permitApplicationOrigin?: PermitApplicationOrigin;
  revision?: number | null;
  previousRevision?: string | null;
  documentId?: string;
}

/**
 * Type used to describe an application.
 * This type essentially represents the same concept as a permit, but with some minor differences.
 * This type is primarily used for listing applications that were created, as well as used for
 * form values when creating and updating applications and permits. The datetime fields for this type
 * use Dayjs type, since these fields will be used by form inputs/elements.
 */
export interface Application extends PartialApplication {
  createdDateTime?: Dayjs;
  updatedDateTime?: Dayjs;
  permitData: PermitData;
}

/**
 * Type that replaces all Dayjs types inside direct PermitData entries to string types
 * 
 * eg. PermitData = { c?: Dayjs }, 
 * 
 * and T = { a: number, b: PermitData },
 * 
 * then TransformPermitData = { a: number, b: { c?: string } }
 */
type TransformPermitData<T> = {
  [K in keyof T]: T[K] extends PermitData ? ReplaceDayjsWithString<PermitData> : T[K];
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

export interface PermitData {
  startDate: Dayjs;
  permitDuration: number; // days
  expiryDate: Dayjs;
  contactDetails?: ContactDetails;
  vehicleDetails?: VehicleDetails;
  commodities: Commodities[];
  mailingAddress: MailingAddress;
  feeSummary?: string;
  companyName?: string;
  clientNumber?: string;
}

export interface PermitApplicationInProgress extends Omit<
  ReplaceDayjsWithString<
    Required<Application>
  >,
  "originalPermitId" | 
  "comment" |
  "permitApplicationOrigin" | 
  "permitApprovalSource" | 
  "permitNumber" | 
  "permitStatus" | 
  "documentId" |
  "revision" |
  "previousRevision"
> {
  permitApplicationOrigin?: PermitApplicationOrigin | null;
  permitApprovalSource?: PermitApprovalSource | null;
  permitData: ReplaceDayjsWithString<PermitData>;
  permitNumber?: string | null;
  permitStatus: typeof PERMIT_STATUSES.IN_PROGRESS;
  documentId?: string | null;
}

export type ApplicationInProgress = PermitApplicationInProgress;
