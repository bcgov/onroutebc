// Data used to populate a .docx template
export interface PermitTemplateData {
  permitName: string;
  permitNumber: string;
  permitType: string;
  createdDateTime: string;
  updatedDateTime: string;
  companyName: string;
  companyAlternateName: string;
  clientNumber: string;
  issuedBy: string;
  revisions: Revision[];
  permitData?: PermitData;
}

interface Revision {
  timeStamp: string;
  description: string;
}

export interface PermitData {
  startDate: string;
  permitDuration: number; //days
  expiryDate: string;
  feeSummary: string;
  contactDetails?: ContactDetails;
  vehicleDetails?: VehicleDetails;
  commodities: Commodities[];
  mailingAddress: MailingAddress;
  companyName: string;
  clientNumber: string;
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

interface Commodities {
  description: string;
  condition: string;
  conditionLink: string;
  checked: boolean;
  disabled?: boolean;
}
