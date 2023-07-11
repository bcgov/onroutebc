import { Typography } from "@mui/material";

import "./CompanyBanner.scss";
import { CompanyProfile } from "../../../features/manageProfile/types/manageProfile";
import { getDefaultRequiredVal } from "../../helpers/util";

export const CompanyBanner = ({
  companyInfo,
}: {
  companyInfo?: CompanyProfile;
}) => {
  return (
    <div className="company-banner">
      <div className="company-banner__company-name">
        <Typography 
          variant="h5"
          data-testid="company-banner-name-label"
        >
          COMPANY NAME
        </Typography>
        <Typography
          variant="h4"
          data-testid="company-banner-name"
        >
          {getDefaultRequiredVal("", companyInfo?.legalName)}
        </Typography>
      </div>
      <div className="company-banner__client-number">
        <Typography 
          variant="h5"
          data-testid="company-banner-client-label"
        >
          onRouteBC CLIENT NUMBER
        </Typography>
        <Typography
          variant="h4"
          data-testid="company-banner-client"
        >
          {getDefaultRequiredVal("", companyInfo?.clientNumber)}
        </Typography>
      </div>
    </div>
  );
};
