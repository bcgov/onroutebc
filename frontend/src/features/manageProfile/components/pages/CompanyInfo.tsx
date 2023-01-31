import { Box } from "@mui/material";
import { useState } from "react";
import { BANNER_GREY, BC_PRIMARY_BLUE } from "../../../../themes/bcGovStyles";
import { CompanyInfoForm } from "../forms/CompanyInfoForm";

import "./ManageProfilePages.scss";
import { DisplayInfo } from "./DisplayCompanyInfo";

const Header = () => {
  return <h2 className="company-header">Edit Company Information</h2>;
};

const CompanyBanner = () => {
  return (
    <Box
      sx={{
        height: 100,
        backgroundColor: BANNER_GREY,
        color: BC_PRIMARY_BLUE,
        marginTop: "20px",
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div className="company-banner">
        <p>COMPANY NAME</p>
        <h2>Bandstra Transportation Systems Ltd.</h2>
      </div>
      <div className="company-banner">
        <p>onRouteBC CLIENT NUMBER</p>
        <h2>2023-87456</h2>
      </div>
    </Box>
  );
};

export const CompanyInfo = () => {
  const [isEditting, setIsEditting] = useState(false);

  return (
    <>
      {isEditting ? <Header /> : null}
      <CompanyBanner />
      {isEditting ? (
        <CompanyInfoForm setIsEditting={setIsEditting} />
      ) : (
        <DisplayInfo setIsEditting={setIsEditting} />
      )}
    </>
  );
};

CompanyInfo.displayName = "CompanyInfo";
