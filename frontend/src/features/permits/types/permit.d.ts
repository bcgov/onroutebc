import { Dayjs } from "dayjs";
import { PermitStatus } from "./PermitStatus";

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
  [K in keyof T]: T[K] extends Dayjs
    ? string
    : T[K] extends Dayjs | undefined
    ? string | undefined
    : T[K];
};

/**
 * A partial permit type. This is an incomplete type and meant to be extended for use.
 */
interface PartialPermitType {
  permitId: number;
  permitStatus: PermitStatus;
  companyId: number;
  userGuid?: string | null;
  permitType: string;
  applicationNumber: string;
  permitNumber: string;
  permitApprovalSource: string;
  permitApplicationOrigin: string;
  documentId?: string;
}

/**
 * The response object structure from the permit API.
 */
export interface ReadPermitDto extends PartialPermitType {
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
  [K in keyof T]: T[K] extends TermOversizeApplication
    ? ReplaceDayjsWithString<TermOversizeApplication>
    : T[K];
};

interface MailingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  provinceCode: string;
  countryCode: string;
  postalCode: string;
}

interface ContactDetails {
  firstName: string;
  lastName: string;
  phone1: string;
  phone1Extension?: string;
  phone2?: string;
  phone2Extension?: string;
  email: string;
  fax?: string;
}

interface VehicleDetails {
  vin: string;
  plate: string;
  make: string;
  year: number | null;
  countryCode: string;
  provinceCode: string;
  vehicleType: string;
  vehicleSubType: string;
  saveVehicle?: boolean;
  unitNumber?: string | undefined;
}

interface Commodities {
  description: string;
  condition: string;
  conditionLink: string;
  checked: boolean;
  disabled?: boolean;
}

interface TermOversizeApplication {
  startDate: Dayjs;
  permitDuration: number; //days
  expiryDate: Dayjs;
  contactDetails?: ContactDetails;
  vehicleDetails?: VehicleDetails;
  commodities: Commodities[];
  mailingAddress: MailingAddress;
  feeSummary: string;
  companyName?: string;
  clientNumber?: string;
}

export interface PermitHistory {
  permitNumber: string;
  comment: string;
  transactionAmount: number;
  transactionOrderNumber: string;
  providerTransactionId: number;
  paymentMethod: string;
}
