import { Nullable } from "../../../common/types/common";

export interface ExtraordinaryLoadRequest {
  isExtraordinaryLoadRequest: boolean;
  approvalNumber?: Nullable<string>;
}
