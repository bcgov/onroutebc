import { doUniqueArraysHaveSameItems } from "../../../common/helpers/equality";
import { Nullable, RequiredOrNull } from "../../../common/types/common";
import { PermitType } from "../../permits/types/PermitType";

export const NO_FEE_PERMIT_TYPES = {
  CA_GOVT: "CA_GOVT",
  MUNICIPALITY: "MUNICIPALITY",
  SCHOOL: "SCHOOL",
  USA_FEDERAL_GOVT: "USA_FEDERAL_GOVT",
  OTHER_USA_GOVT: "OTHER_USA_GOVT",
} as const;

export type NoFeePermitType = typeof NO_FEE_PERMIT_TYPES[keyof typeof NO_FEE_PERMIT_TYPES];

export const DEFAULT_NO_FEE_PERMIT_TYPE = NO_FEE_PERMIT_TYPES.CA_GOVT;

export const noFeePermitTypeDescription = (noFeePermitType: NoFeePermitType) => {
  switch (noFeePermitType) {
    case NO_FEE_PERMIT_TYPES.CA_GOVT:
      return "The government of Canada or any province or territory";
    case NO_FEE_PERMIT_TYPES.MUNICIPALITY:
      return "A municipality";
    case NO_FEE_PERMIT_TYPES.SCHOOL:
      return "A school district outside of BC (S. 9 Commercial Transport Act)";
    case NO_FEE_PERMIT_TYPES.USA_FEDERAL_GOVT:
      return "The government of the United States of America";
    default:
      return "The government of any state or county in the United States of America";
  }
};

export interface LOADetail {
  loaId: number;
  loaNumber: number;
  companyId: number;
  startDate: string;
  expiryDate?: Nullable<string>;
  documentId: string;
  fileName: string;
  loaPermitType: PermitType[];
  comment?: Nullable<string>;
  powerUnits: string[];
  trailers: string[];
  originalLoaId: number;
  previousLoaId?: Nullable<number>;
}

export interface CreateLOARequestData {
  startDate: string;
  expiryDate?: Nullable<string>;
  loaPermitType: PermitType[];
  // document: Buffer;
  comment?: Nullable<string>;
  powerUnits: string[];
  trailers: string[];
}

export interface UpdateLOARequestData {
  startDate: string;
  expiryDate?: Nullable<string>;
  loaPermitType: PermitType[];
  // document?: Buffer;
  comment?: Nullable<string>;
  powerUnits: string[];
  trailers: string[];
}

/**
 * Determine whether or not two LOAs have the same details.
 * @param loa1 First LOA
 * @param loa2 Second LOA
 * @returns Whether or not the two LOAs have the same details
 */
export const areLOADetailsEqual = (
  loa1?: Nullable<LOADetail>,
  loa2?: Nullable<LOADetail>,
) => {
  if (!loa1 && !loa2) return true;
  if (!loa1 || !loa2) return false;
  
  return loa1.loaId === loa2.loaId
    && loa1.loaNumber === loa2.loaNumber
    && loa1.companyId === loa2.companyId
    && loa1.startDate === loa2.startDate
    && loa1.expiryDate === loa2.expiryDate
    && loa1.documentId === loa2.documentId
    && loa1.fileName === loa2.fileName
    && doUniqueArraysHaveSameItems<string>(loa1.loaPermitType, loa2.loaPermitType)
    && loa1.comment === loa2.comment
    && doUniqueArraysHaveSameItems<string>(loa1.powerUnits, loa2.powerUnits)
    && doUniqueArraysHaveSameItems<string>(loa1.trailers, loa2.trailers)
    && loa1.originalLoaId === loa2.originalLoaId
    && loa1.previousLoaId === loa2.previousLoaId;
};
export interface SpecialAuthorizationData {
  companyId: number;
  specialAuthId: number;
  isLcvAllowed: boolean;
  noFeeType: RequiredOrNull<NoFeePermitType>;
}
