import { Box } from "@mui/material";
import { memo, useState } from "react";
import { InfoBcGovBanner } from "../../../../common/components/alertBanners/AlertBanners";
import { BC_PRIMARY_BLUE } from "../../../../themes/bcGovStyles";
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
        backgroundColor: "#EBEEF3",
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

export const EditCompanyInfo = memo(() => {
  const [isEditting, setIsEditting] = useState(false);

  return (
    <>
      {isEditting ? <Header /> : null}
      <CompanyBanner />
      {isEditting ? (
        <>
          <InfoBcGovBanner description="Please note, unless stated otherwise, all fields are mandatory." />
          <CompanyInfoForm />
        </>
      ) : (
        <DisplayInfo setIsEditting={setIsEditting} />
      )}
    </>
  );
});

EditCompanyInfo.displayName = "EditCompanyInfo";
