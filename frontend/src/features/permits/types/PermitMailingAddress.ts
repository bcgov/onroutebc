import { Nullable } from "../../../common/types/common";

export interface PermitMailingAddress {
  addressLine1: string;
  addressLine2?: Nullable<string>;
  city: string;
  provinceCode: string;
  countryCode: string;
  postalCode: string;
}
