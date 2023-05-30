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

interface Commodities {
  description: string;
  condition: string;
  conditionLink: string;
  checked: boolean;
  disabled?: boolean;
}

export interface PermitData {
  startDate: string;
  permitDuration: number; //days
  expiryDate: string;
  contactDetails?: ContactDetails;
  vehicleDetails?: VehicleDetails;
  commodities: Commodities[];
  mailingAddress: MailingAddress;
}
