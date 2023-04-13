/**
 * Type for displaying snackbar (aka toast message) after an operation.
 */
export interface CompanyMetadataContextType {
  companyMetadata: CompanyMetadata;
  setCompanyMetadata: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Company Basic Info type
 */
export interface CompanyMetadata {
  companyId: string;
  clientNumber: string;
  legalName: string;
}

/**
 * User Context object type
 */
export interface UserContextType {
  associatedCompanies: CompanyMetadata[];
  pendingCompanies: CompanyMetadata[];
  user?: {
    userAuthGroup?: string;
    statusCode?: string;
    userGUID?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    phone1?: string;
    phone2?: string;
    fax?: string;
    email?: string;
    city?: string;
    provinceCode?: string;
    countryCode?: string;
    phone1Extension?: string | null;
    phone2Extension?: string | null;
  };
}
