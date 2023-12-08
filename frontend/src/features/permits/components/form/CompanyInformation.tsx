import { Box, Typography } from "@mui/material";

import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { Nullable } from "../../../../common/types/common";
import {
  formatCountry,
  formatProvince,
} from "../../../../common/helpers/formatCountryProvince";

import {
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../themes/orbcStyles";

export const CompanyInformation = ({
  companyInfo,
}: {
  companyInfo?: Nullable<CompanyProfile>;
}) => {
  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography
          variant={"h3"}
          sx={PERMIT_LEFT_HEADER_STYLE}
          data-testid="company-info-header-title"
        >
          Company Information
        </Typography>
        <Typography
          sx={{ width: "320px" }}
          data-testid="company-info-header-desc"
        >
          If the Company Mailing Address is incorrect, please contact your
          onRouteBC Administrator.
        </Typography>
      </Box>
      {companyInfo?.mailingAddress ? (
        <Box sx={PERMIT_RIGHT_BOX_STYLE}>
          <Typography variant={"h3"} data-testid="company-mail-addr-title">
            Company Mailing Address
          </Typography>
          <Box>
            <Typography data-testid="company-mail-addr-line1">
              {companyInfo.mailingAddress.addressLine1}
            </Typography>
            <Typography data-testid="company-mail-addr-country">
              {formatCountry(companyInfo.mailingAddress.countryCode)}
            </Typography>
            <Typography data-testid="company-mail-addr-prov">
              {formatProvince(
                companyInfo.mailingAddress.countryCode,
                companyInfo.mailingAddress.provinceCode,
              )}
            </Typography>
            <Typography data-testid="company-mail-addr-city-postal">
              {`${companyInfo.mailingAddress.city} ${companyInfo.mailingAddress.postalCode}`}
            </Typography>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};
