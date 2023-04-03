import { Dayjs } from "dayjs";

/**
 * A base permit type. This is an incomplete object and meant to be extended for use.
 */
export interface Application {
  applicationId: number;
  dateCreated: Dayjs;
  lastUpdated: Dayjs;
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
  city: string;
}

interface VehicleDetails {
  vin: string;
  plate: string;
  make: string;
  year: string;
  countryCode: string;
  provinceCode: string;
  vehicleType: string;
  vehicleSubType: string;
}

export interface TermOversizeApplication extends Application {
  application: {
    startDate: Dayjs;
    permitDuration: number; //days
    expiryDate: Dayjs;
    contactDetails?: ContactDetails;
    vehicleDetails?: VehicleDetails;
    commodities: string[];
  };
}
