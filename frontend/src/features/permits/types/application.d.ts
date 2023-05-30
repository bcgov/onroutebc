import { Dayjs } from "dayjs";

type ReplaceDayjsWithString<T> = {
  [K in keyof T]: T[K] extends Dayjs ? string : (T[K] extends (Dayjs | undefined) ? (string | undefined) : T[K]);
};

/**
 * A base permit type. This is an incomplete object and meant to be extended for use.
 */
export interface Application {
  permitId?: number;
  permitStatus?: string;
  companyId: number;
  userGuid?: string | null;
  permitType: string;
  applicationNumber?: string;
  permitNumber?: number;
  permitApprovalSource?: string;
  createdDateTime?: Dayjs;
  updatedDateTime?: Dayjs;
  permitData: TermOversizeApplication;
}

type TransformPermitData<T> = {
  [K in keyof T]: T[K] extends TermOversizeApplication ? ReplaceDayjsWithString<TermOversizeApplication> : T[K];
};

export type ApplicationResponse = TransformPermitData<ReplaceDayjsWithString<Application>>;
export type ApplicationRequestData = TransformPermitData<ReplaceDayjsWithString<Application>>;

interface MailingAddress {
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
}

export interface PermitApplicationInProgress extends Application {
  permitId: string
  applicationNumber: string;
  permitType: string;
  startDate: Dayjs;
  updatedDateTime: Dayjs;
  permitData: {
    startDate: Dayjs;
    vehicleDetails: {
      unitNumber: string;
      vin: string;
      plate: string;
    };
  };
}

export type ApplicationInProgress = PermitApplicationInProgress;
