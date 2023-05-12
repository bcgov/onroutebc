import { Typography } from "@mui/material";
import { useState } from "react";

import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { CompanyInfoForm } from "../components/forms/companyInfo/CompanyInfoForm";
import { DisplayInfo } from "./DisplayCompanyInfo";
import { CompanyBanner } from "../../../common/components/banners/CompanyBanner";
import { CompanyProfile } from "../types/manageProfile";

const Header = () => {
  return (
    <Typography
      variant="h4"
      sx={{ color: BC_COLOURS.bc_black, marginTop: "20px" }}
    >
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
  companyInfoData: CompanyProfile | undefined;
}) => {
  const [isEditting, setIsEditting] = useState(false);

  return (
    <>
      {isEditting ? <Header /> : null}
      <CompanyBanner companyInfo={companyInfoData} />
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
    </>
  );
};

CompanyInfo.displayName = "CompanyInfo";
