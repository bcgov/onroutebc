import { Box, Typography } from "@mui/material";

import "./ReviewVehicleWeightSection.scss";
import {
  isNull,
  isUndefined,
  Nullable,
} from "../../../../../../common/types/common";
import { DiffChip } from "./DiffChip";
import { areValuesDifferent } from "../../../../../../common/helpers/equality";

export const ReviewVehicleWeightSection = ({
  loadedGVW,
  oldLoadedGVW,
  netWeight,
  oldNetWeight,
  showChangedFields = false,
}: {
  loadedGVW?: Nullable<number>;
  oldLoadedGVW?: Nullable<number>;
  netWeight?: Nullable<number>;
  oldNetWeight?: Nullable<number>;
  showChangedFields?: boolean;
}) => {
  // 0 is not considered empty, so we only need to check for nullable values
  const isWeightValueEmpty = (weight?: Nullable<number>) =>
    isNull(weight) || isUndefined(weight);

  const changedFields = showChangedFields
    ? {
        loadedGVW:
          isWeightValueEmpty(loadedGVW) !== isWeightValueEmpty(oldLoadedGVW) ||
          areValuesDifferent(loadedGVW, oldLoadedGVW),
        netWeight:
          isWeightValueEmpty(netWeight) !== isWeightValueEmpty(oldNetWeight) ||
          areValuesDifferent(netWeight, oldNetWeight),
      }
    : {
        loadedGVW: false,
        netWeight: false,
      };

  const showDiffChip = (show: boolean) => {
    return show ? <DiffChip /> : null;
  };

  const vehicleWeightNotEmpty =
    !isWeightValueEmpty(loadedGVW) || !isWeightValueEmpty(netWeight);

  return vehicleWeightNotEmpty ? (
    <Box className="review-vehicle-weight-section">
      <Box className="review-vehicle-weight-section__header">
        <Typography
          variant={"h3"}
          className="review-vehicle-weight-section__title"
        >
          Vehicle Weight
        </Typography>
      </Box>

      <Box className="review-vehicle-weight-section__body">
        {!isWeightValueEmpty(loadedGVW) ? (
          <div className="review-vehicle-weight-section__info">
            <Typography className="review-vehicle-weight-section__label">
              <span className="review-vehicle-weight-section__label-text">
                Actual GVW (kg)
              </span>
              {showDiffChip(changedFields.loadedGVW)}
            </Typography>

            <Typography
              className="review-vehicle-weight-section__data"
              data-testid="review-vehicle-weight-loaded-gvw"
            >
              {loadedGVW}
            </Typography>
          </div>
        ) : null}

        {!isWeightValueEmpty(netWeight) ? (
          <div className="review-vehicle-weight-section__info">
            <Typography className="review-vehicle-weight-section__label">
              <span className="review-vehicle-weight-section__label-text">
                Net Weight (kg)
              </span>
              {showDiffChip(changedFields.netWeight)}
            </Typography>

            <Typography
              className="review-vehicle-weight-section__data"
              data-testid="review-vehicle-weight-net-weight"
            >
              {netWeight}
            </Typography>
          </div>
        ) : null}
      </Box>
    </Box>
  ) : null;
};
