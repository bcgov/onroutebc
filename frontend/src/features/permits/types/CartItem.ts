import { Nullable } from "../../../common/types/common";
import { ValidationResults } from "../../policy/types/ValidationResults";
import { PermitApplicationOrigin } from "./PermitApplicationOrigin";
import { PermitStatus } from "./PermitStatus";
import { PermitType } from "./PermitType";
import { ThirdPartyLiability } from "./ThirdPartyLiability";
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
  duration: number;
  totalDistance?: Nullable<number>;
  permitApplicationOrigin: PermitApplicationOrigin;
  thirdPartyLiability?: Nullable<ThirdPartyLiability>;
  validationResults: ValidationResults;
}

export interface SelectableCartItem extends CartItem {
  selected: boolean;
  isSelectable: boolean;
  fee: number;
}

export interface CartActionResponse extends PermitsActionResponse {}
