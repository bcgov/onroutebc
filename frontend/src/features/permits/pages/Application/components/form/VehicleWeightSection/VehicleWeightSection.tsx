import { Box } from "@mui/material";

import "./VehicleWeightSection.scss";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { Nullable, RequiredOrNull } from "../../../../../../../common/types/common";
import { VehicleWeightInput } from "./components/VehicleWeightInput";

export const VehicleWeightSection = ({
  permitType,
  isVehicleSubtypeEmpty,
  enableLoadedGVW,
  loadedGVW,
  enableNetWeight,
  netWeight,
  onUpdateLoadedGVW,
  onUpdateNetWeight,
}: {
  permitType: PermitType;
  isVehicleSubtypeEmpty: boolean;
  enableLoadedGVW: boolean;
  loadedGVW?: Nullable<number>;
  enableNetWeight: boolean;
  netWeight?: Nullable<number>;
  onUpdateLoadedGVW: (
    updatedLoadedGVW: RequiredOrNull<number>,
  ) => void;
  onUpdateNetWeight: (
    updatedNetWeight: RequiredOrNull<number>,
  ) => void;
}) => {
  const showSection = ([
    PERMIT_TYPES.NRSCV,
    PERMIT_TYPES.NRQCV,
  ] as PermitType[]).includes(permitType);

  const loadedGVWInputClassName = `vehicle-weight-section__input vehicle-weight-section__input--loaded-gvw`
    + (enableLoadedGVW ? "" : " vehicle-weight-section__input--disabled");

  const netWeightInputClassName = `vehicle-weight-section__input vehicle-weight-section__input--net-weight`
    + (enableNetWeight ? "" : " vehicle-weight-section__input--disabled");
  
  return showSection ? (
    <Box className="vehicle-weight-section">
      <Box className="vehicle-weight-section__header">
        <h3 className="vehicle-weight-section__title">Vehicle Weight</h3>
      </Box>

      <Box className="vehicle-weight-section__body">
        <VehicleWeightInput
          name="permitData.vehicleConfiguration.loadedGVW"
          label={{
            id: "loaded-gvw-input-label",
            component: "Loaded GVW (kg)",
          }}
          className={loadedGVWInputClassName}
          isEnabled={enableLoadedGVW}
          shouldValidateWhenEmpty={isVehicleSubtypeEmpty}
          value={loadedGVW}
          onUpdateValue={onUpdateLoadedGVW}
        />

        <VehicleWeightInput
          name="permitData.vehicleConfiguration.netWeight"
          label={{
            id: "net-weight-input-label",
            component: "Net Weight (kg)",
          }}
          className={netWeightInputClassName}
          isEnabled={enableNetWeight}
          shouldValidateWhenEmpty={isVehicleSubtypeEmpty}
          value={netWeight}
          onUpdateValue={onUpdateNetWeight}
        />
      </Box>
    </Box>
  ) : null;
};
