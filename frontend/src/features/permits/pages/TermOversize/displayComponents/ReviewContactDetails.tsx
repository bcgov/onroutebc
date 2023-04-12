import { Box, Typography } from "@mui/material";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../../themes/orbcStyles";
import { TermOversizeApplication } from "../../../types/application";

export const ReviewContactDetails = ({
  values,
}: {
  values: TermOversizeApplication | undefined;
}) => {
  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}>
          Contact Information
        </Typography>
      </Box>
      <Box sx={PERMIT_RIGHT_BOX_STYLE}>
        <Box sx={{ gap: "40px", paddingTop: "24px" }}>
          <Typography>
            {values?.application.contactDetails?.firstName}{" "}
            {values?.application.contactDetails?.lastName}
          </Typography>
          <Typography>
            Primary Phone: {values?.application.contactDetails?.phone1} Ext:{" "}
            {values?.application.contactDetails?.phone1Extension}
          </Typography>
          <Typography>
            Email: {values?.application.contactDetails?.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
