import { Dayjs } from "dayjs";

import { Nullable } from "../../../common/types/common";
import { PERMIT_TYPES } from "../../permits/types/PermitType";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { now } from "../../../common/helpers/formatDate";

export interface LOAFormData {
  permitTypes: {
    [PERMIT_TYPES.STOS]: boolean;
    [PERMIT_TYPES.TROS]: boolean;
    [PERMIT_TYPES.STOW]: boolean;
    [PERMIT_TYPES.TROW]: boolean;
    [PERMIT_TYPES.STOL]: boolean;
    [PERMIT_TYPES.STWS]: boolean;
  };
  startDate: Dayjs;
  expiryDate?: Nullable<Dayjs>;
  neverExpires: boolean;
  uploadFile: Nullable<{
    fileName: string;
    fileSize: number;
    fileMimeType: string;
  }> | File;
  additionalNotes?: Nullable<string>;
  selectedPowerUnits: {
    vehicleId: string;
    unitNumber?: Nullable<string>;
    make: string;
    vin: string;
    plate: string;
    vehicleSubType: string;
  }[];
  selectedTrailers: {
    vehicleId: string;
    unitNumber?: Nullable<string>;
    make: string;
    vin: string;
    plate: string;
    vehicleSubType: string;
  }[];
}

export const defaultLOAFormData = (
  formData?: Nullable<LOAFormData>,
): LOAFormData => {
  const permitTypes = getDefaultRequiredVal({
    [PERMIT_TYPES.STOS]: false,
    [PERMIT_TYPES.TROS]: false,
    [PERMIT_TYPES.STOW]: false,
    [PERMIT_TYPES.TROW]: false,
    [PERMIT_TYPES.STOL]: false,
    [PERMIT_TYPES.STWS]: false,
  }, formData?.permitTypes);

  const startDate = getDefaultRequiredVal(now(), formData?.startDate);
  const neverExpires = getDefaultRequiredVal(false, formData?.neverExpires);
  const expiryDate = neverExpires ? null : getDefaultRequiredVal(null, formData?.expiryDate);
  const additionalNotes = getDefaultRequiredVal("", formData?.additionalNotes);
  const selectedPowerUnits = getDefaultRequiredVal([], formData?.selectedPowerUnits);
  const selectedTrailers = getDefaultRequiredVal([], formData?.selectedTrailers);
  const defaultFile = formData?.uploadFile ? formData.uploadFile : null;

  return {
    permitTypes,
    startDate,
    expiryDate,
    neverExpires,
    uploadFile: defaultFile,
    additionalNotes,
    selectedPowerUnits,
    selectedTrailers,
  };
};
