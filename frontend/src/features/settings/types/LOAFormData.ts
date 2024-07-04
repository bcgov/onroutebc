import { Dayjs } from "dayjs";

import { Nullable } from "../../../common/types/common";
import { PERMIT_TYPES } from "../../permits/types/PermitType";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../common/helpers/util";
import { getEndOfDate, getStartOfDate, now, toLocalDayjs } from "../../../common/helpers/formatDate";
import { LOAVehicle } from "./LOAVehicle";
import { LOADetail } from "./SpecialAuthorization";

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
  }> | File;
  additionalNotes?: Nullable<string>;
  selectedVehicles: {
    powerUnits: Record<string, Nullable<LOAVehicle>>;
    trailers: Record<string, Nullable<LOAVehicle>>;
  };
}

export const loaDetailToFormData = (
  loaDetail?: Nullable<LOADetail>,
): LOAFormData => {
  const loaDetailPermitTypes = getDefaultRequiredVal([], loaDetail?.loaPermitType);
  const permitTypes = {
    [PERMIT_TYPES.STOS]: loaDetailPermitTypes.includes(PERMIT_TYPES.STOS),
    [PERMIT_TYPES.TROS]: loaDetailPermitTypes.includes(PERMIT_TYPES.TROS),
    [PERMIT_TYPES.STOW]: loaDetailPermitTypes.includes(PERMIT_TYPES.STOW),
    [PERMIT_TYPES.TROW]: loaDetailPermitTypes.includes(PERMIT_TYPES.TROW),
    [PERMIT_TYPES.STOL]: loaDetailPermitTypes.includes(PERMIT_TYPES.STOL),
    [PERMIT_TYPES.STWS]: loaDetailPermitTypes.includes(PERMIT_TYPES.STWS),
  };

  const startDate = applyWhenNotNullable(
    startDateStr => getStartOfDate(toLocalDayjs(startDateStr)),
    loaDetail?.startDate,
    now(),
  );
  const expiryDate = applyWhenNotNullable(
    expiryDateStr => getEndOfDate(toLocalDayjs(expiryDateStr)),
    loaDetail?.expiryDate,
    null,
  );
  const neverExpires = !expiryDate;
  const additionalNotes = getDefaultRequiredVal("", loaDetail?.comment);
  const powerUnits = applyWhenNotNullable(
    powerUnitsArr => Object.fromEntries(powerUnitsArr.map(powerUnitId => [powerUnitId, null])),
    loaDetail?.powerUnits,
    {},
  );
  const trailers = applyWhenNotNullable(
    trailersArr => Object.fromEntries(trailersArr.map(trailerId => [trailerId, null])),
    loaDetail?.trailers,
    {},
  );
  const defaultFile = {
    fileName: "",
    // fileName: getDefaultRequiredVal("", loaDetail?.documentName),
  };

  return {
    permitTypes,
    startDate,
    expiryDate,
    neverExpires,
    uploadFile: defaultFile,
    additionalNotes,
    selectedVehicles: {
      powerUnits,
      trailers,
    },
  };
};
