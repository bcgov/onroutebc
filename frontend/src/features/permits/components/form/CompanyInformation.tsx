import { Box, Typography } from "@mui/material";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { formatCountry, formatProvince } from "../../../../common/helpers/formatCountryProvince";
import { 
  PERMIT_LEFT_BOX_STYLE, 
  PERMIT_LEFT_HEADER_STYLE, 
  PERMIT_MAIN_BOX_STYLE, 
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../themes/orbcStyles";

export const CompanyInformation = ({
  companyInfo,
}: {
  companyInfo?: CompanyProfile;
}) => {
  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}>
          Company Information
        </Typography>
        <Typography sx={{ width: "320px" }}>
          If the Company Mailing Address is incorrect, please contact your
          onRouteBC Administrator.
        </Typography>
      </Box>
      {companyInfo?.mailingAddress ? (
        <Box sx={PERMIT_RIGHT_BOX_STYLE}>
          <Typography variant={"h3"}>Company Mailing Address</Typography>
          <Box>
            <Typography>{companyInfo.mailingAddress.addressLine1}</Typography>
            <Typography>
              {formatCountry(companyInfo.mailingAddress.countryCode)}
            </Typography>
            <Typography>
              {formatProvince(
                companyInfo.mailingAddress.countryCode,
                companyInfo.mailingAddress.provinceCode
              )}
            </Typography>
            <Typography>
              {`${companyInfo.mailingAddress.city} ${companyInfo.mailingAddress.postalCode}`}
            </Typography>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};
