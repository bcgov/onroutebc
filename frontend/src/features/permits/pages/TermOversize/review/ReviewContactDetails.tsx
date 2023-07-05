import { Box, Typography } from "@mui/material";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../../themes/orbcStyles";
import { Application } from "../../../types/application";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";

const phoneDisplay = (label: string, phone?: string, ext?: string) => {
  if (!phone) return "";
  const firstPart = `${label}: ${phone}`;
  const secondPart = getDefaultRequiredVal("", ext).trim() !== "" ? 
    `Ext: ${ext}` : "";
  return `${firstPart} ${secondPart}`;
};

export const ReviewContactDetails = ({
  values,
}: {
  values: Application | undefined;
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
            {values?.permitData.contactDetails?.firstName}{" "}
            {values?.permitData.contactDetails?.lastName}
          </Typography>
          <Typography>
            {phoneDisplay(
              "Primary Phone", 
              values?.permitData.contactDetails?.phone1, 
              values?.permitData.contactDetails?.phone1Extension
            )}
          </Typography>
          {values?.permitData.contactDetails?.phone2 ? (
            <Typography>
              {phoneDisplay(
                "Alternate Phone", 
                values?.permitData.contactDetails?.phone2, 
                values?.permitData.contactDetails?.phone2Extension
              )}
            </Typography>
          ) : null}
          <Typography>
            Email: {values?.permitData.contactDetails?.email}
          </Typography>
          {values?.permitData?.contactDetails?.fax ? (
            <Typography>
              {phoneDisplay(
                "Fax", 
                values?.permitData.contactDetails?.fax
              )}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};
