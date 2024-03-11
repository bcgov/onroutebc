import { Dayjs } from "dayjs";

import { PermitStatus } from "./PermitStatus";
import { PermitType } from "./PermitType";
import { ReplaceDayjsWithString } from "./utility";
import { Nullable } from "../../../common/types/common";
import { PermitApplicationOrigin } from "./PermitApplicationOrigin";
import { PermitApprovalSource } from "./PermitApprovalSource";
import { PermitData } from "./PermitData";

/**
 * A partial permit type that consists of all common fields used for a permit.
 * This is an incomplete type and meant to be extended for use.
 */
export interface PartialApplication {
  permitId?: Nullable<string>;
  originalPermitId?: Nullable<string>;
  comment?: Nullable<string>;
  permitStatus: PermitStatus;
  companyId: number;
  userGuid?: Nullable<string>;
  permitType: PermitType;
  applicationNumber?: Nullable<string>;
  permitNumber?: Nullable<string>;
  permitApprovalSource?: Nullable<PermitApprovalSource>;
  permitApplicationOrigin?: Nullable<PermitApplicationOrigin>;
  revision?: Nullable<number>;
  previousRevision?: Nullable<string>;
  documentId?: Nullable<string>;
}

/**
 * Type used to represent the concept of an application.
 * The datetime fields for this type use Dayjs type, since these fields will be used by form inputs/elements.
 */
export interface Application extends PartialApplication {
  createdDateTime?: Nullable<Dayjs>;
  updatedDateTime?: Nullable<Dayjs>;
  permitData: PermitData;
  applicant?: Nullable<string>;
}

/**
 * Type that replaces all Dayjs types inside direct PermitData entries to string types.
 *
 * eg. PermitData = { c?: Dayjs },
 *
 * and T = { a: number, b: PermitData },
 *
 * then TransformPermitData = { a: number, b: { c?: string } }
 */
type TransformPermitData<T> = {
  [K in keyof T]: T[K] extends PermitData
    ? ReplaceDayjsWithString<PermitData>
    : T[K];
};

/**
 * Type for response data from fetching Application details.
 */
export interface ApplicationResponseData extends TransformPermitData<
  ReplaceDayjsWithString<Application>
>{};

/**
 * Type for create application request payload.
 */
export interface CreateApplicationRequestData {
  companyId: number;
  permitId?: Nullable<string>;
  originalPermitId?: Nullable<string>;
  applicationNumber?: Nullable<string>;
  previousRevision?: Nullable<string>;
  revision?: Nullable<number>;
  permitType: PermitType;
  permitApprovalSource?: Nullable<PermitApprovalSource>;
  permitApplicationOrigin?: Nullable<PermitApplicationOrigin>;
  permitData: ReplaceDayjsWithString<PermitData>;
  comment?: Nullable<string>;
};

/**
 * Type for update application request payload.
 */
export interface UpdateApplicationRequestData {
  companyId?: Nullable<number>;
  permitType?: Nullable<PermitType>;
  permitData: ReplaceDayjsWithString<PermitData>;
  comment?: Nullable<string>;
}

/**
 * Type used for application items that are fetched in a list (eg. Applications in Progress).
 */
export interface ApplicationListItem {
  companyId: number;
  legalName: string;
  alternateName?: Nullable<string>;
  permitId: string;
  permitType: PermitType;
  applicationNumber: string;
  permitStatus: PermitStatus;
  permitApplicationOrigin: PermitApplicationOrigin;
  startDate: string;
  expiryDate: string;
  createdDateTime: string;
  updatedDateTime: string;
  applicant: string;
  unitNumber?: Nullable<string>;
  vin?: Nullable<string>;
  plate?: Nullable<string>;
}

/**
 * Type used for permit and application form data.
 */
export interface ApplicationFormData {
  permitId?: Nullable<string>;
  originalPermitId?: Nullable<string>;
  comment?: Nullable<string>;
  permitStatus: PermitStatus;
  companyId: number;
  permitType: PermitType;
  applicationNumber?: Nullable<string>;
  permitNumber?: Nullable<string>;
  permitData: PermitData;
}
