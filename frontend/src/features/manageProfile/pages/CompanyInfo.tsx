import { Typography } from "@mui/material";
import { useState } from "react";

import "./CompanyInfo.scss";
import { CompanyInfoForm } from "../components/forms/companyInfo/CompanyInfoForm";
import { DisplayCompanyInfo } from "./DisplayCompanyInfo";
import { CompanyBanner } from "../../../common/components/banners/CompanyBanner";
import { CompanyProfile } from "../types/manageProfile";
import { Optional } from "../../../common/types/common";

const Header = () => {
  return (
    <Typography className="company-info-page__header" variant="h4">
      Edit Client Information
    </Typography>
  );
};

/**
 * Company Information page that includes includes React components for displaying and editing Company Information
 */
export const CompanyInfo = ({
  companyInfoData,
}: {
  companyInfoData: Optional<CompanyProfile>;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="company-info-page">
      {isEditing && <Header />}
      {!isEditing && (
        <CompanyBanner
          companyName={companyInfoData?.legalName}
          clientNumber={companyInfoData?.clientNumber}
        />
      )}
      {isEditing ? (
        <CompanyInfoForm
          companyInfo={companyInfoData}
          setIsEditing={setIsEditing}
        />
      ) : (
        <DisplayCompanyInfo
          companyInfo={companyInfoData}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

CompanyInfo.displayName = "CompanyInfo";
