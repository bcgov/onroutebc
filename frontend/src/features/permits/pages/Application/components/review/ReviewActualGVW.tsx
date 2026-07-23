import { Box, Typography } from "@mui/material";

import "./ReviewActualGVW.scss";
import { Nullable } from "../../../../../../common/types/common";
import { PERMIT_TYPES, PermitType } from "../../../../types/PermitType";
import { getLicensedGVWIncrease } from "../../../../helpers/vehicleWeightHelper";

export const ReviewActualGVW = ({
  permitType,
  actualGVW,
  licensedGVW,
}: {
  permitType?: Nullable<PermitType>;
  actualGVW: number;
  licensedGVW: number;
}) => {
  if (permitType !== PERMIT_TYPES.STGVWI) {
    return null;
  }
  const licensedGVWIncrease = getLicensedGVWIncrease(actualGVW, licensedGVW);
  return (
    <Box className="review-actual-gvw">
      <Box className="review-actual-gvw__header">
        <Typography variant="h3">Actual GVW</Typography>
      </Box>

      <Box className="review-actual-gvw__body">
        <Box className="info-section">
          <div className="info-section__info">
            <Typography className="info-section__label">
              Actual GVW (kg)
            </Typography>

            <Typography
              className="info-section__data"
              data-testid="review-actual-gvw"
            >
              {actualGVW?.toLocaleString()}
            </Typography>
          </div>

          <div className="info-section__info">
            <Typography className="info-section__label">
              Licensed GVW Increase (kg)
            </Typography>

            <Typography
              className="info-section__data"
              data-testid="review-licensed-gvw-increase"
            >
              {licensedGVWIncrease.toLocaleString()}
            </Typography>
          </div>
        </Box>
      </Box>
    </Box>
  );
};
