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
  // dimensions, weights, distances, currency need to be formatted in the template
  // TemplatePermitData contains all of the PermitData values plus required formatted numbers
  permitData?: TemplatePermitData;
  loas?: string;
  permitIssueDateTime?: string;
  revisionIssueDateTime?: string;
  thirdPartyLiability?: string;
  conditionalLicensingFee?: string;
  overloadVW?: Nullable<string>; // formatted number
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
  /**
   * ICBC Insurance Certificate info for HC permit types
   */
  icbcInsuranceCertificate?: Nullable<ICBCInsuranceCertificate>;
  /**
   * Extraordinary Load Request info for STOW permit types
   */
  extraordinaryLoadRequest?: Nullable<ExtraordinaryLoadRequest>;
}

interface ICBCInsuranceCertificate {
  haveCertificate: boolean;
  certificateNumber?: Nullable<string>;
}

interface ExtraordinaryLoadRequest {
  isExtraordinaryLoadRequest: boolean;
  approvalNumber?: Nullable<string>;
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
  actualGVW?: Nullable<number>;
  netWeight?: Nullable<number>;
  axleConfiguration?: Nullable<AxleConfiguration[]>;
  vehicleDisplayCode?: Nullable<string>;
  overloadWeight?: Nullable<number>;
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
  axleConfiguration?: AxleConfiguration[];
  vehicleDescription?: Nullable<string>;
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

interface TemplateVehicleDetails extends Omit<VehicleDetails, 'licensedGVW'> {
  licensedGVW?: string; // field used as formatted number
}

interface TemplateVehicleConfiguration {
  overallLength?: Nullable<string>; // formatted number
  overallWidth?: Nullable<string>; // formatted number
  overallHeight?: Nullable<string>; // formatted number
  frontProjection?: Nullable<string>; // formatted number
  rearProjection?: Nullable<string>; // formatted number
  trailers?: VehicleDetails[];
  loadedGVW?: Nullable<string>; // formatted number
  actualGVW?: Nullable<string>; // formatted number
  netWeight?: Nullable<string>; // formatted number
  axleConfiguration?: Nullable<AxleConfiguration[]>;
  vehicleDisplayCode?: Nullable<string>;
  overloadWeight?: Nullable<string>; // formatted number
}

interface TemplateManualRoute extends Omit<ManualRoute, 'totalDistance'> {
  totalDistance?: string; // formatted number
}

interface TemplatePermittedRoute {
  routeDetails: string;
  manualRoute: TemplateManualRoute;
}

interface TemplatePermitData extends Omit<
  PermitData,
  'vehicleDetails' | 'vehicleConfiguration' | 'permittedRoute'
> {
  vehicleDetails?: TemplateVehicleDetails;
  vehicleConfiguration?: TemplateVehicleConfiguration;
  permittedRoute?: TemplatePermittedRoute;
}
