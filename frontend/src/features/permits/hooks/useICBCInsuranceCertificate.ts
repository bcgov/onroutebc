import { useEffect } from "react";

import { Nullable } from "../../../common/types/common";
import { PERMIT_TYPES, PermitType } from "../types/PermitType";
import { getDefaultRequiredVal } from "../../../common/helpers/util";

export const useICBCInsuranceCertificate = (
  permitType: PermitType,
  haveCertificate: boolean,
  onUpdateCertificateNumber: (updatedCertificateNumber?: Nullable<string>) => void,
  onSetPlate: (plate: string) => void,
  onSetVehicleId: (vehicleId: Nullable<string>) => void,
  onToggleSaveVehicle: (saveVehicle: boolean) => void,
  certificateNumber?: Nullable<string>,
) => {
  useEffect(() => {
    if (permitType === PERMIT_TYPES.HC) {
      const certNumberInForm = getDefaultRequiredVal("", certificateNumber);
      if (!haveCertificate && certNumberInForm) {
        onUpdateCertificateNumber(null);
        onSetPlate("");
      } else if (haveCertificate) {
        onSetVehicleId("");
        onToggleSaveVehicle(false);

        if (!certNumberInForm) {
          onSetPlate("");
        } else {
          onSetPlate(certNumberInForm);
        }
      }
    }
  }, [
    permitType,
    haveCertificate,
    certificateNumber,
  ]);
};
