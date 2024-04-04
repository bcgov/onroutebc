import { Nullable } from "../../../common/types/common";
import { PermitType } from "./PermitType";

/**
 * Type used to represent an (Application) item in the cart.
 */
export interface CartItem {
  companyId: number;
  permitId: string;
  permitType: PermitType;
  applicationNumber: string;
  startDate: string;
  expiryDate: string;
  createdDateTime: string;
  updatedDateTime: string;
  applicant: string;
  plate?: Nullable<string>;
  feeSummary: string;
};

export interface SelectableCartItem extends CartItem {
  selected: boolean;
  isSelectable: boolean;
}
