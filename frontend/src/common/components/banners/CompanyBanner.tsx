import { Typography } from "@mui/material";

import "./CompanyBanner.scss";
import { getDefaultRequiredVal } from "../../helpers/util";

export const CompanyBanner = ({
  companyName,
  clientNumber,
}: {
  companyName?: string;
  clientNumber?: string;
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
          {getDefaultRequiredVal("", companyName)}
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
          {getDefaultRequiredVal("", clientNumber)}
        </Typography>
      </div>
    </div>
  );
};
