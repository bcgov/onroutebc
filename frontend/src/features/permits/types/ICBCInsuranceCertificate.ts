import { Nullable } from "../../../common/types/common";

export interface ICBCInsuranceCertificate {
  haveCertificate: boolean;
  certificateNumber?: Nullable<string>;
}
