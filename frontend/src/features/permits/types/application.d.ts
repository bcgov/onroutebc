import { Dayjs } from "dayjs";

/**
 * A base permit type. This is an incomplete object and meant to be extended for use.
 */
export interface Application {
  permitId?: number;
  permitStatus?: string;
  companyId: number;
  userGuid?: string;
  permitType: string;
  applicationNumber?: string;
  permitNumber?: number;
  permitApprovalSource?: string;
  permitApprovalSource?: string;
  createdDateTime?: Dayjs;
  updatedDateTime?: Dayjs;
  permitData: TermOversizeApplication;
}

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

export interface PermitApplicationInProgress extends Application{
  applicationNumber: String;
  permitType: String;
  startDate: Dayjs;
  updatedDateTime: Dayjs;
  permitData: {
    startDate: Dayjs;
    vehicleDetails: {
      unitNumber: String;
      vin: String;
      plate: String;
    }
  }
}

export type ApplicationInProgress = PermitApplicationInProgress;
