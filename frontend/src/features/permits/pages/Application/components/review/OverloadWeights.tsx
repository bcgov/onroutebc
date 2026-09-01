import { Box, Typography } from "@mui/material";

import "./OverloadWeights.scss";
import { areValuesDifferent } from "../../../../../../common/helpers/equality";
import { Nullable } from "../../../../../../common/types/common";
import { DiffChip } from "./DiffChip";
import { PermitVehicleConfiguration } from "../../../../types/PermitVehicleConfiguration";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { PERMIT_TYPES, PermitType } from "../../../../types/PermitType";

export const OverloadWeights = ({
  permitType,
  vehicleConfiguration,
  oldVehicleConfiguration,
  showChangedFields = false,
}: {
  permitType?: Nullable<PermitType>;
  vehicleConfiguration?: Nullable<PermitVehicleConfiguration>;
  oldVehicleConfiguration?: Nullable<PermitVehicleConfiguration>;
  showChangedFields?: boolean;
}) => {
  const changedFields = showChangedFields
    ? {
        overloadWeight: areValuesDifferent(
          vehicleConfiguration?.overloadWeight,
          oldVehicleConfiguration?.overloadWeight,
        ),
      }
    : {
        overloadWeight: false,
      };

  const showOverloadWeights = permitType === PERMIT_TYPES.STWSE;

  return showOverloadWeights ? (
    <Box className="review-overload-weights">
      <Box className="review-overload-weights__header">
        <Typography variant={"h3"} className="review-overload-weights__title">
          Overload (kg)
        </Typography>
      </Box>

      <Box className="review-overload-weights__body">
        <div className="overload overload--overload-weight">
          <Typography className="overload__label">
            <span className="overload__label-text">Weight Over 27.5m</span>

            {changedFields.overloadWeight ? <DiffChip /> : null}
          </Typography>

          <Typography
            className="overload__data"
            data-testid="permit-overload-weight"
          >
            {getDefaultRequiredVal(
              0,
              vehicleConfiguration?.overloadWeight,
            ).toFixed(2)}
          </Typography>
        </div>
      </Box>
    </Box>
  ) : null;
};
