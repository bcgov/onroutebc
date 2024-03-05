import { Typography } from "@mui/material";
import { useState } from "react";

import "./CompanyInfo.scss";
import { CompanyInfoForm } from "../components/forms/companyInfo/CompanyInfoForm";
import { DisplayInfo } from "./DisplayCompanyInfo";
import { CompanyBanner } from "../../../common/components/banners/CompanyBanner";
import { CompanyProfile } from "../types/manageProfile";
import { Optional } from "../../../common/types/common";

const Header = () => {
  return (
    <Typography className="company-info-page__header" variant="h4">
      Edit Company Information
    </Typography>
  );
};

/**
 * Company Information page that includes includes React components for displaying and editting Company Information
 */
export const CompanyInfo = ({
  companyInfoData,
}: {
  companyInfoData: Optional<CompanyProfile>;
}) => {
  const [isEditting, setIsEditting] = useState(false);

  return (
    <div className="company-info-page">
      {isEditting ? <Header /> : null}
      <CompanyBanner
        companyName={companyInfoData?.legalName}
        clientNumber={companyInfoData?.clientNumber}
      />
      {isEditting ? (
        <CompanyInfoForm
          companyInfo={companyInfoData}
          setIsEditting={setIsEditting}
        />
      ) : (
        <DisplayInfo
          companyInfo={companyInfoData}
          setIsEditting={setIsEditting}
        />
      )}
    </div>
  );
};

CompanyInfo.displayName = "CompanyInfo";
