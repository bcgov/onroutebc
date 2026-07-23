import { Controller } from "react-hook-form";

import "./actualgvw.scss";
import { getLicensedGVWIncrease } from "../../../../../helpers/vehicleWeightHelper";
import {
  ORBCFormFeatureType,
  RequiredOrNull,
} from "../../../../../../../common/types/common";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { NumberInput } from "../../../../../../../common/components/form/subFormComponents/NumberInput";
import { getDefaultRequiredVal } from "../../../../../../../common/helpers/util";
import { convertToNumberIfValid } from "../../../../../../../common/helpers/numeric/convertToNumberIfValid";

export const ActualGVW = ({
  feature,
  permitType,
  actualGVW,
  licensedGVW,
  onUpdateActualGVW,
}: {
  feature: ORBCFormFeatureType;
  permitType: PermitType;
  actualGVW: number;
  licensedGVW: number;
  onUpdateActualGVW: (updatedActualGVW?: RequiredOrNull<number>) => void;
}) => {
  const handleUpdateActualGVW = (numericStr: string) => {
    const updatedActualGVW = getDefaultRequiredVal(
      null,
      convertToNumberIfValid(numericStr, null),
    );

    onUpdateActualGVW(updatedActualGVW);
  };

  const licensedGVWIncrease = getLicensedGVWIncrease(actualGVW, licensedGVW);

  if (permitType !== PERMIT_TYPES.STGVWI) {
    return null;
  }
  return (
    <div className="actual-gvw-section">
      <div className="actual-gvw-section__header">
        <h3>Actual GVW (kg)</h3>
      </div>

      <div className="actual-gvw-section__body">
        <Controller
          name="permitData.vehicleConfiguration.actualGVW"
          rules={{
            required: {
              value: true,
              message: "This is a required field",
            },
            validate: {
              greaterThanLicensed: (value) =>
                value > licensedGVW || "Must be greater than Licensed GVW.",
              maxAllowed: (value) => value <= 63500 || "Cannot exceed 63,500kg",
            },
          }}
          render={({ fieldState: { error } }) => (
            <NumberInput
              label={{
                id: `${feature}-actual-gvw-label`,
                component: "Actual GVW (kg)",
              }}
              classes={{
                root: "actual-gvw-section__input",
              }}
              inputProps={{
                value: getDefaultRequiredVal(null, actualGVW),
                onBlur: (e) => handleUpdateActualGVW(e.target.value),
              }}
              helperText={
                error?.message
                  ? {
                      errors: [error.message],
                    }
                  : undefined
              }
            />
          )}
        />

        <hr className="actual-gvw-section__divider" />

        <div className="actual-gvw-section__increase-info">
          <strong>Licensed GVW Increase (kg):</strong> {licensedGVWIncrease}
        </div>
      </div>
    </div>
  );
};
