/**
 * Type for displaying snackbar (aka toast message) after an operation.
 */
export interface CompanyMetadataContextType {
  companyMetadata: CompanyMetadata;
  setCompanyMetadata: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CompanyMetadata {
    legalName: string;
    companyId: string;
    clientNumber: string;
}
