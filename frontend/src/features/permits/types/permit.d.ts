import { Dayjs } from "dayjs";

/**
 * A type that replaces all direct entries with Dayjs types to string types.
 * 
 * eg. T = { a: Dayjs, b: number } 
 * 
 * then ReplaceDayjsWithString = { a: string, b: number }
 * 
 * eg. T = { a?: Dayjs, b: number }, 
 * 
 * then ReplaceDayjsWithString = { a?: string, b: number }
 */
type ReplaceDayjsWithString<T> = {
  [K in keyof T]: T[K] extends Dayjs ? string : (T[K] extends (Dayjs | undefined) ? (string | undefined) : T[K]);
};

/**
 * A base permit type. This is an incomplete object and meant to be extended for use.
 */
export interface Permit {
  permitId: number;
  permitStatus: string;
  companyId: number;
  userGuid?: string | null;
  permitType: string;
  applicationNumber: string;
  permitNumber: string;
  permitApprovalSource: string;
  permitApplicationOrigin: string;
  permitIssueDateTime: Dayjs;
  documentId?: string;
  createdDateTime: Dayjs;
  updatedDateTime: Dayjs;
  permitData: TermOversizeApplication;
}

/**
 * The Read
 */
export interface ReadPermitDto extends Permit {
  permitIssueDateTime?: string;
  createdDateTime: string;
  updatedDateTime: string;
  permitData: ReplaceDayjsWithString<TermOversizeApplication>;
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
  feeSummary: string;
}

export interface PermitApplicationInProgress {
  applicationNumber: string;
  companyId: number;
  createdDateTime: string;
  permitApplicationOrigin?: string | null;
  permitApprovalSource?: string | null;
  permitData: ReplaceDayjsWithString<TermOversizeApplication>;
  permitId: string
  permitNumber?: string | null;
  permitStatus: "IN_PROGRESS";
  permitType: string;
  updatedDateTime: string;
  userGuid: string;
}

export type ApplicationInProgress = PermitApplicationInProgress;
