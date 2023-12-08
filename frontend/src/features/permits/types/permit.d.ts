import { ReplaceDayjsWithString } from "./utility";
import { PartialApplication, PermitData } from "./application";
import { Nullable } from "../../../common/types/common";

/**
 * A partial permit type that consists of all common fields used for a permit.
 * This is an incomplete type and meant to be extended for use.
 */
interface PartialPermit
  extends Omit<
    Required<PartialApplication>,
    "previousRevision" | "comment" | "userGuid" | "documentId" | "permitId"
  > {
  previousRevision?: Nullable<number>;
  comment?: Nullable<string>;
  userGuid?: Nullable<string>;
  documentId?: string;
  permitId: number;
}

/**
 * The request/response object structure to describe the permit object,
 * and used with the permit API.
 *
 * This type is mostly used as a data transfer object (DTO) to pass permit objects
 * between frontend and backend, and also used on the frontend for permit-related logic.
 */
export interface Permit extends PartialPermit {
  permitIssueDateTime?: Nullable<string>;
  createdDateTime: string;
  updatedDateTime: string;
  permitData: ReplaceDayjsWithString<PermitData>;
}

/**
 * Type used to describe the response object from void/revoke/amend actions.
 */
export interface PermitsActionResponse {
  success: string[];
  failure: string[];
}

/**
 * Type used to describe the request payload object for issuing permits.
 */
export interface IssuePermitRequest {
  applicationIds: string[];
  companyId?: number;
}

/**
 * Type used to describe the response object for issuing permits.
 */
export type IssuePermitsResponse = PermitsActionResponse;
