import "./ActualGVWSection.scss";

import { CustomFormComponent } from "../../../../../../../common/components/form/CustomFormComponents";
import {
  invalidInput,
  invalidNumber,
  licensedGVWExceeded,
  mustBeGreaterThan,
  requiredMessage,
} from "../../../../../../../common/helpers/validationMessages";
import { ORBCFormFeatureType } from "../../../../../../../common/types/common";
import { getLicensedGVWIncrease } from "../../../../../helpers/vehicleWeightHelper";
import { gvwLimit } from "../../../../../helpers/vehicles/rules/gvw";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";

export const ActualGVW = ({
  feature,
  permitType,
  actualGVW,
  licensedGVW,
}: {
  feature: ORBCFormFeatureType;
  permitType: PermitType;
  actualGVW: number;
  licensedGVW: number;
}) => {
  if (permitType !== PERMIT_TYPES.STGVWI) {
    return null;
  }

  const licensedGVWIncrease = getLicensedGVWIncrease(actualGVW, licensedGVW);

  return (
    <div className="actual-gvw-section">
      <div className="actual-gvw-section__header">
        <h3>Actual GVW (kg)</h3>
      </div>

      <div className="actual-gvw-section__body">
        <CustomFormComponent
          className="actual-gvw-section__input"
          type="input"
          feature={feature}
          options={{
            name: "permitData.vehicleConfiguration.actualGVW",
            inputType: "number",
            label: "Actual GVW (kg)",
            rules: {
              required: {
                value: true,
                message: requiredMessage(),
              },
              min: {
                value: 0,
                message: invalidInput(),
              },
              validate: {
                isNumber: (v) => !isNaN(v) || invalidNumber(),
                greaterThanLicensed: (v) =>
                  Number(v) > licensedGVW ||
                  "Must be greater than Licensed GVW.",
                greaterThanZero: (v) => Number(v) > 0 || mustBeGreaterThan(0),
                exceededGvw: (v) => {
                  const maxAllowedGvw = gvwLimit(permitType);
                  if (maxAllowedGvw === undefined) {
                    return true;
                  }
                  return (
                    Number(v) <= maxAllowedGvw ||
                    licensedGVWExceeded(maxAllowedGvw, true)
                  );
                },
              },
            },
          }}
        />

        <hr className="actual-gvw-section__divider" />

        <div className="actual-gvw-section__increase-info">
          <strong>Licensed GVW Increase (kg):</strong> {licensedGVWIncrease}
        </div>
      </div>
    </div>
  );
};
