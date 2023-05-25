import { Box, Typography } from "@mui/material";
import { PermitExpiryDateBanner } from "../../../../../common/components/banners/PermitExpiryDateBanner";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../../themes/orbcStyles";
import { Application } from "../../../types/application";
import { ReviewConditionsTable } from "./ReviewConditionsTable";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { formatDate } from "../../../../../common/helpers/formatDate";

export const ReviewPermitDetails = ({
  values,
}: {
  values: Application | undefined;
}) => {
  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}>
          Permit Details
        </Typography>
      </Box>
      <Box sx={PERMIT_RIGHT_BOX_STYLE}>
        <Box sx={{ gap: "40px", paddingTop: "24px" }}>
          <Typography sx={{ fontWeight: "bold" }}>Start Date:</Typography>
          {getDefaultRequiredVal(
            "",
            (values?.permitData?.startDate?.$u !== null)? values?.permitData?.startDate?.format("LL"): formatDate(
              new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                timeZoneName: "short",
              }), values?.permitData?.startDate
            )
            )}
          <Typography sx={{ fontWeight: "bold" }}>Permit Duration:</Typography>
          <Typography>{values?.permitData.permitDuration} Days</Typography>
        </Box>
        <PermitExpiryDateBanner
          expiryDate={getDefaultRequiredVal(
            "",
            values?.permitData?.expiryDate
          )}
        />
        <Box>
          <Typography variant="h3">
            Selected commodities and their respective CVSE forms.
          </Typography>
          <ReviewConditionsTable values={values} />
        </Box>
      </Box>
    </Box>
  );
};
