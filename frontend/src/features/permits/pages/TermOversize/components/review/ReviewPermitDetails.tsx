import { Box, Typography } from "@mui/material";
import { Dayjs } from "dayjs";

import "./ReviewPermitDetails.scss";
import { PermitExpiryDateBanner } from "../../../../../../common/components/banners/PermitExpiryDateBanner";
import { Commodities } from "../../../../types/application";
import { ReviewConditionsTable } from "./ReviewConditionsTable";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { DATE_FORMATS, dayjsToLocalStr } from "../../../../../../common/helpers/formatDate";

export const ReviewPermitDetails = ({
  startDate,
  permitDuration,
  expiryDate,
  conditions,
}: {
  startDate?: Dayjs;
  permitDuration?: number;
  expiryDate?: Dayjs;
  conditions?: Commodities[];
}) => {
  return (
    <Box className="review-permit-details">
      <Box className="review-permit-details__header">
        <Typography variant={"h3"} className="review-permit-details__title">
          Permit Details
        </Typography>
      </Box>
      <Box className="review-permit-details__body">
        <Box className="permit-dates">
          <Typography className="permit-dates__label">
            Start Date:
          </Typography>
          <Typography 
            className="permit-dates__data"
            data-testid="permit-start-date"
          >
            {applyWhenNotNullable(
              (dayJsObject) => dayjsToLocalStr(dayJsObject, DATE_FORMATS.DATEONLY_SLASH),
              startDate,
              ""
            )}
          </Typography>
          <Typography className="permit-dates__label">
            Permit Duration:
          </Typography>
          <Typography 
            className="permit-dates__data"
            data-testid="permit-duration"
          >
            {getDefaultRequiredVal(30, permitDuration)} Days
          </Typography>
        </Box>
        <Box className="permit-expiry-banner">
          <PermitExpiryDateBanner
            expiryDate={applyWhenNotNullable(
              (dayJsObject) => dayjsToLocalStr(dayJsObject, DATE_FORMATS.SHORT),
              expiryDate,
              ""
            )}
          />
        </Box>
        <Box className="permit-conditions">
          <Typography variant="h3">
            Selected commodities and their respective CVSE forms.
          </Typography>
          <ReviewConditionsTable conditions={conditions} />
        </Box>
      </Box>
    </Box>
  );
};
