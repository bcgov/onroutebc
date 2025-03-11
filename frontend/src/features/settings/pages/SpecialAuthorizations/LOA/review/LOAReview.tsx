import { useFormContext } from "react-hook-form";

import "./LOAReview.scss";
import { LOAFormData } from "../../../../types/LOAFormData";
import { DATE_FORMATS, dayjsToLocalStr } from "../../../../../../common/helpers/formatDate";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { VEHICLE_TYPES, VehicleSubType } from "../../../../../manageVehicles/types/Vehicle";
import { vehicleTypeDisplayText } from "../../../../../manageVehicles/types/Vehicle";

export const LOAReview = ({
  powerUnitSubtypes,
  trailerSubtypes,
}: {
  powerUnitSubtypes: VehicleSubType[];
  trailerSubtypes: VehicleSubType[];
}) => {
  const { getValues } = useFormContext<LOAFormData>();
  const formData = getValues();

  const selectedPermitTypes =
    Object.entries(formData.permitTypes)
      .filter(permitTypeSelection => permitTypeSelection[1])
      .map(([permitType]) => permitType);

  const startDate = dayjsToLocalStr(
    formData.startDate,
    DATE_FORMATS.DATEONLY_SLASH,
  );

  const expiryDate = applyWhenNotNullable(
    (expiry) => dayjsToLocalStr(expiry, DATE_FORMATS.DATEONLY_SLASH),
    formData.expiryDate,
    "LOA never expires",
  );

  const fileName = applyWhenNotNullable(
    (file) => {
      if (file instanceof File) return file.name;
      return file.fileName;
    },
    formData.uploadFile,
    ""
  );

  const vehicleSubtype = getDefaultRequiredVal(
    "",
    formData.vehicleType === VEHICLE_TYPES.TRAILER
      ? trailerSubtypes.find(({ typeCode }) => typeCode === formData.vehicleSubtype)?.type
      : powerUnitSubtypes.find(({ typeCode }) => typeCode === formData.vehicleSubtype)?.type,
  );

  return (
    <div className="loa-review">
      <div className="loa-review__section loa-review__section--permit-types">
        <div className="loa-review__header">Permit Type(s)</div>
        <div className="loa-review__data">
          {selectedPermitTypes.join(", ")}
        </div>
      </div>

      <div className="loa-review__section loa-review__section--vehicle">
        <div className="loa-review__header">Vehicle Information</div>
        <div className="loa-review__data">
          <p>
            Vehicle Type: {vehicleTypeDisplayText(formData.vehicleType)}
          </p>

          <p>
            Vehicle Sub-type: {vehicleSubtype}
          </p>
        </div>
      </div>

      <div className="loa-review__section loa-review__section--start">
        <div className="loa-review__header">Start Date</div>
        <div className="loa-review__data">
          {startDate}
        </div>
      </div>

      <div className="loa-review__section loa-review__section--expiry">
        <div className="loa-review__header">Expiry Date</div>
        <div className="loa-review__data">
          {expiryDate}
        </div>
      </div>

      <div className="loa-review__section loa-review__section--loa">
        <div className="loa-review__header">LOA</div>
        <div className="loa-review__data">
          {fileName}
        </div>
      </div>

      {formData.additionalNotes ? (
        <div className="loa-review__section loa-review__section--notes">
          <div className="loa-review__header">Additional Notes</div>
          <div className="loa-review__data">
            {formData.additionalNotes}
          </div>
        </div>
      ) : null}
    </div>
  );
};
