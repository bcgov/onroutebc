import { Box, Typography } from "@mui/material";

import "./ReviewPermitDetails.scss";
import { PermitExpiryDateBanner } from "../../../../../common/components/banners/PermitExpiryDateBanner";
import { Application } from "../../../types/application";
import { ReviewConditionsTable } from "./ReviewConditionsTable";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { DATE_FORMATS, dayjsToLocalStr } from "../../../../../common/helpers/formatDate";

export const ReviewPermitDetails = ({
  values,
}: {
  values: Application | undefined;
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
              values?.permitData?.startDate,
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
            {getDefaultRequiredVal(30, values?.permitData.permitDuration)} Days
          </Typography>
        </Box>
        <Box className="permit-expiry-banner">
          <PermitExpiryDateBanner
            expiryDate={applyWhenNotNullable(
              (dayJsObject) => dayjsToLocalStr(dayJsObject, DATE_FORMATS.SHORT),
              values?.permitData?.expiryDate,
              ""
            )}
          />
        </Box>
        <Box className="permit-conditions">
          <Typography variant="h3">
            Selected commodities and their respective CVSE forms.
          </Typography>
          <ReviewConditionsTable values={values} />
        </Box>
      </Box>
    </Box>
  );
};
