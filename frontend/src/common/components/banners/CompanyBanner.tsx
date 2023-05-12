import { Typography } from "@mui/material";

import "./CompanyBanner.scss";
import { CompanyProfile } from "../../../features/manageProfile/types/manageProfile";

export const CompanyBanner = ({
  companyInfo,
}: {
  companyInfo?: CompanyProfile;
}) => {
  return (
    <div className="company-banner">
      <div className="company-banner__company-name">
        <Typography variant="h5">COMPANY NAME</Typography>
        <Typography variant="h4">{companyInfo?.legalName}</Typography>
      </div>
      <div className="company-banner__client-number">
        <Typography variant="h5">onRouteBC CLIENT NUMBER</Typography>
        <Typography variant="h4">{companyInfo?.clientNumber}</Typography>
      </div>
    </div>
  );
};
