import { Dayjs } from "dayjs";

/**
 * A base permit type. This is an incomplete object and meant to be extended for use.
 */
export interface Application {
  companyId: number;
  applicationId?: number;
  applicationName: string;
  dateCreated?: Dayjs;
  lastUpdated?: Dayjs;
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

export interface TermOversizeApplication extends Application {
  application: {
    startDate: Dayjs;
    permitDuration: number; //days
    expiryDate: Dayjs;
    contactDetails?: ContactDetails;
    vehicleDetails?: VehicleDetails;
    commodities: Commodities[];
    mailingAddress: MailingAddress;
  };
}
