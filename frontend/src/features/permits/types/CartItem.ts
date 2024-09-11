import { PermitStatus } from "./PermitStatus";
import { PermitType } from "./PermitType";
import { PermitsActionResponse } from "./permit";

/**
 * Type used to represent an (Application) item in the cart.
 */
export interface CartItem {
  companyId: number;
  applicationId: string;
  permitType: PermitType;
  applicationNumber: string;
  permitStatus: PermitStatus;
  updatedDateTime: string;
  applicant: string;
  applicantGUID: string;
  plate: string;
  startDate: string;
  expiryDate: string;
  fee: number;
  permitDuration: number;
};

export interface SelectableCartItem extends CartItem {
  selected: boolean;
  isSelectable: boolean;
}

export interface CartActionResponse extends PermitsActionResponse {}
