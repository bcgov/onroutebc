import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { CompanyInfoForm } from "../forms/CompanyInfoForm";

import { DisplayInfo } from "./DisplayCompanyInfo";
import { useQuery } from "@tanstack/react-query";
import {
  CompanyProfile,
  getCompanyInfo,
} from "../../apiManager/manageProfileAPI";

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

const CompanyBanner = ({ companyInfo }: { companyInfo?: CompanyProfile }) => {
  return (
    <Box
      sx={{
        height: 100,
        backgroundColor: BC_COLOURS.banner_grey,
        color: BC_COLOURS.bc_primary_blue,
        marginTop: "20px",
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Typography variant="h5">COMPANY NAME</Typography>
        <Typography variant="h4">{companyInfo?.legalName}</Typography>
      </div>
      <div>
        <Typography variant="h5">onRouteBC CLIENT NUMBER</Typography>
        <Typography variant="h4">{companyInfo?.clientNumber}</Typography>
      </div>
    </Box>
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
    queryFn: () => getCompanyInfo(),
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
