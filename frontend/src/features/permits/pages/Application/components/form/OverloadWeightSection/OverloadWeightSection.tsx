import { Box } from "@mui/material";

import "./OverloadWeightSection.scss";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import {
  Nullable,
  ORBCFormFeatureType,
  RequiredOrNull,
} from "../../../../../../../common/types/common";
import { PermitVehicleConfiguration } from "../../../../../types/PermitVehicleConfiguration";
import { OverloadWeightInput } from "./components/OverloadWeightInput";

export const OverloadWeightSection = ({
  permitType,
  feature,
  vehicleConfiguration,
  onUpdateVehicleConfiguration,
}: {
  permitType: PermitType;
  feature: ORBCFormFeatureType;
  vehicleConfiguration?: Nullable<PermitVehicleConfiguration>;
  onUpdateVehicleConfiguration: (
    updatedVehicleConfig: RequiredOrNull<PermitVehicleConfiguration>,
  ) => void;
}) => {
  return permitType === PERMIT_TYPES.STWSE ? (
    <Box className="overload-weight-section">
      <Box className="overload-weight-section__header">
        <h3 className="overload-weight-section__title">Overload (kg)</h3>
      </Box>

      <Box className="overload-weight-section__body">
        <div className="overload-weight-section__input-row overload-weight-section__input-row--first">
          <OverloadWeightInput
            name="permitData.vehicleConfiguration.overloadWeight"
            label={{
              id: `${feature}-overload-weight-label`,
              component: "Weight Over 27.5m",
            }}
            className="overload-weight-section__input overload-weight-section__input--first"
            value={vehicleConfiguration?.overloadWeight}
            onUpdateValue={(updatedValue) =>
              onUpdateVehicleConfiguration({
                ...vehicleConfiguration,
                overloadWeight: updatedValue,
              })
            }
            minValue={0}
          />
        </div>
      </Box>
    </Box>
  ) : null;
};
