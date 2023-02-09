import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { CompanyInfoForm } from "../forms/CompanyInfoForm";

import "./ManageProfilePages.scss";
import { DisplayInfo } from "./DisplayCompanyInfo";
import { useQuery } from "@tanstack/react-query";
import {
  CompanyProfile,
  createCompanyInfo,
  getCompanyInfo,
} from "../../apiManager/manageProfileAPI";

const Header = () => {
  return <h2 className="company-header">Edit Company Information</h2>;
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
      <div className="company-banner">
        <p>COMPANY NAME</p>
        <h2>{companyInfo?.legalName}</h2>
      </div>
      <div className="company-banner">
        <p>onRouteBC CLIENT NUMBER</p>
        <h2>{companyInfo?.clientNumber}</h2>
      </div>
    </Box>
  );
};

export const CompanyInfo = () => {
  const [isEditting, setIsEditting] = useState(false);

  const {
    data: companyInfoData,
    //refetch,
  } = useQuery({
    queryKey: ["companyInfo"],
    queryFn: () => getCompanyInfo("TEST_changeme"),
    keepPreviousData: true,
    staleTime: 5000,
  });

  // For testing
  if (!companyInfoData) {
    return (
      <div style={{ marginTop: "20px" }}>
        <Typography>
          For Testing: Click the button below to create a user
        </Typography>
        <Typography>
          This button makes a post request with sample data, simulating logging
          in with bceid and completing the wizard
        </Typography>
        <Button
          key="update-company-info-button"
          aria-label="Update Company Info"
          variant="contained"
          color="primary"
          onClick={createCompanyInfo}
          sx={{ marginTop: "20px" }}
        >
          TEST!
        </Button>
      </div>
    );
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
