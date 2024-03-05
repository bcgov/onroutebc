import { Box, Typography } from "@mui/material";

import "./CompanyInformation.scss";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { Nullable } from "../../../../common/types/common";
import {
  formatCountry,
  formatProvince,
} from "../../../../common/helpers/formatCountryProvince";

export const CompanyInformation = ({
  companyInfo,
  doingBusinessAs,
}: {
  companyInfo?: Nullable<CompanyProfile>;
  doingBusinessAs?: Nullable<string>;
}) => {
  return (
    <Box className="company-info">
      <Box className="company-info__header">
        <Typography
          variant={"h3"}
          data-testid="company-info-header-title"
        >
          Company Information
        </Typography>
        <Typography
          className="company-info__info-msg"
          data-testid="company-info-header-desc"
        >
          If the Company Mailing Address is incorrect, please contact your
          onRouteBC Administrator.
        </Typography>
      </Box>

      <Box className="company-info__body">
        {doingBusinessAs ? (
          <Box className="company-info__doing-business">
            <Typography variant={"h3"} data-testid="doing-business-as-title">
              Doing Business As
            </Typography>
            <Box>
              <Typography data-testid="doing-business-as">
                {doingBusinessAs}
              </Typography>
            </Box>
          </Box>
        ) : null}

        {companyInfo?.mailingAddress ? (
          <Box className="company-info__mailing-addr">
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
    </Box>
  );
};
