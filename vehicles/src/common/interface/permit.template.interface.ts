import { ConditionalLicensingFee } from '../enum/conditional-licensing-fee.enum';
import { PermitType } from '../enum/permit-type.enum';
import { ThirdPartyLiability } from '../enum/third-party-liability.enum';
import { VehicleType } from '../enum/vehicle-type.enum';
import { Nullable } from '../types/common';

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
  loas?: string;
  permitIssueDateTime?: string;
  revisionIssueDateTime?: string;
  thirdPartyLiability?: string;
  conditionalLicensingFee?: string;
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
  loas: Loas[]; //Letter of Authorizations
  mailingAddress: MailingAddress;
  companyName: string;
  clientNumber: string;
  vehicleConfiguration?: VehicleConfiguration;
  applicationNotes?: string;
  permittedCommodity?: PermittedCommodity;
  permittedRoute?: PermittedRoute;
  /**
   * Third Party Liability for Non resident ICBC permits
   */
  thirdPartyLiability?: ThirdPartyLiability;
  conditionalLicensingFee?: Nullable<ConditionalLicensingFee>;
}

interface AxleConfiguration {
  axleUnit: number;
  numberOfAxles: number;
  axleSpread?: Nullable<number>;
  interaxleSpacing?: Nullable<number>;
  axleUnitWeight: number;
  numberOfTires?: Nullable<number>;
  tireSize?: number;
}

interface VehicleConfiguration {
  overallLength?: Nullable<number>;
  overallWidth?: Nullable<number>;
  overallHeight?: Nullable<number>;
  frontProjection?: Nullable<number>;
  rearProjection?: Nullable<number>;
  trailers?: VehicleDetails[];
  loadedGVW?: Nullable<number>;
  netWeight?: Nullable<number>;
  axleConfiguration?: Nullable<AxleConfiguration[]>;
  vehicleDisplayCode?: Nullable<string>;
}

interface PermittedRoute {
  routeDetails: string;
  manualRoute: ManualRoute;
}

interface PermittedCommodity {
  commodityType: string;
  loadDescription: string;
}

interface ManualRoute {
  origin: string;
  destination: string;
  exitPoint?: string;
  totalDistance?: number;
  highwaySequence?: string[];
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
  additionalEmail?: string;
}

export interface VehicleDetails {
  vehicleId: string;
  vin: string;
  plate: string;
  make: string;
  year: number | null;
  countryCode: string;
  provinceCode: string;
  vehicleType: string;
  vehicleSubType: string;
  licensedGVW?: number;
  saveVehicle?: boolean;
}

interface Commodities {
  description: string;
  condition: string;
  conditionLink: string;
  checked: boolean;
  disabled?: boolean;
}

export interface Loas {
  loaId: number;
  loaNumber: number;
  companyId: number;
  loaPermitType: PermitType[];
  startDate: string;
  expiryDate?: Nullable<string>;
  vehicleType: VehicleType;
  vehicleSubType: string;
  originalLoaId?: Nullable<number>;
  previousLoaId?: Nullable<number>;
}
