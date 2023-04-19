import { Typography } from "@mui/material";
import { useState } from "react";
import { BC_COLOURS } from "../../../themes/bcGovStyles";
import { CompanyInfoForm } from "../components/forms/CompanyInfoForm";

import { DisplayInfo } from "./DisplayCompanyInfo";
import { useQuery } from "@tanstack/react-query";
import { getCompanyInfo } from "../apiManager/manageProfileAPI";
import { CompanyBanner } from "../../../common/components/banners/CompanyBanner";

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
export const CompanyInfo = () => {
  const [isEditting, setIsEditting] = useState(false);

  const {
    data: companyInfoData,
    isLoading,
    isError,
    error,
    //refetch,
  } = useQuery({
    queryKey: ["companyInfo"],
    queryFn: getCompanyInfo,
    keepPreviousData: true,
    staleTime: 5000,
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    if (error instanceof Error) {
      return <span>Error: {error.message}</span>;
    }
  }

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
