import { LOADetail } from "../../settings/types/SpecialAuthorization";

export interface PermitLOAResponseData extends LOADetail {
  permitLoaId: number;
};

export interface UpdatePermitLOARequestData {
  loaIds: number[];
};
