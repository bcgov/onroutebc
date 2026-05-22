import { useEffect } from "react";
import { Nullable } from "../../../common/types/common";
import { PERMIT_TYPES, PermitType } from "../types/PermitType";
import { getDefaultRequiredVal } from "../../../common/helpers/util";

export const useICBCInsuranceCertificate = (
  permitType: PermitType,
  haveCertificate: boolean,
  onUpdateCertificateNumber: (updatedCertificateNumber?: Nullable<string>) => void,
  onSetPlate: (plate: string) => void,
  certificateNumber?: Nullable<string>,
) => {
  useEffect(() => {
    if (permitType === PERMIT_TYPES.HC && !haveCertificate) {
      onUpdateCertificateNumber(null);
    }
  }, [
    permitType,
    haveCertificate,
  ]);

  useEffect(() => {
    if (permitType === PERMIT_TYPES.HC) {
      onSetPlate(getDefaultRequiredVal("", certificateNumber));
    }
  }, [
    permitType,
    certificateNumber,
  ]);
};
