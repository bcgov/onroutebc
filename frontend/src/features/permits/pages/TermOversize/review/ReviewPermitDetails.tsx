import { Box, Typography } from "@mui/material";
import { PermitExpiryDateBanner } from "../../../../../common/components/banners/PermitExpiryDateBanner";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../../themes/orbcStyles";
import { TermOversizeApplication } from "../../../types/application";
import { ReviewConditionsTable } from "./ReviewConditionsTable";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";

export const ReviewPermitDetails = ({
  values,
}: {
  values: TermOversizeApplication | undefined;
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
          <Typography>{values?.application.startDate.format("LL")}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Permit Duration:</Typography>
          <Typography>{values?.application.permitDuration} Days</Typography>
        </Box>
        <PermitExpiryDateBanner
          expiryDate={getDefaultRequiredVal("", values?.application?.expiryDate?.format("LL"))}
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
