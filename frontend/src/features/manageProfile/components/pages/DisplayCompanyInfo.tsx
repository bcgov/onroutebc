import { Box, Button, Typography } from "@mui/material";
import { memo } from "react";
import { CompanyProfile } from "../../apiManager/manageProfileAPI";

import "./ManageProfilePages.scss";

export const DisplayInfo = memo(
  ({
    companyInfo,
    setIsEditting,
  }: {
    companyInfo?: CompanyProfile;
    setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    return (
      <div className="display-info-container">
        <Box>
          <h2>Company Address</h2>
          <Typography>{companyInfo?.companyAddress.addressLine1}</Typography>
          <Typography>{companyInfo?.companyAddress.countryCode}</Typography>
          <Typography>{companyInfo?.companyAddress.provinceCode}</Typography>
          <Typography>{`${companyInfo?.companyAddress.city} ${companyInfo?.companyAddress.postalCode}`}</Typography>

          <h2>Mailing Address</h2>
          {companyInfo?.mailingAddressSameAsCompanyAddress ? (
            <Typography>Same as Company Address</Typography>
          ) : (
            <>
              <Typography>
                {companyInfo?.mailingAddress?.addressLine1}
              </Typography>
              <Typography>
                {companyInfo?.mailingAddress?.countryCode}
              </Typography>
              <Typography>
                {companyInfo?.mailingAddress?.provinceCode}
              </Typography>
              <Typography>{`${companyInfo?.mailingAddress?.city} ${companyInfo?.mailingAddress?.postalCode}`}</Typography>
            </>
          )}

          <h2>Company Contact Details</h2>
          <Typography>Email: {companyInfo?.email}</Typography>
          <Typography>{`Phone: ${companyInfo?.phone} ${
            companyInfo?.extension ? `Ext: ${companyInfo?.extension}` : ""
          }`}</Typography>
          {companyInfo?.fax ? (
            <Typography>Fax: {companyInfo?.fax}</Typography>
          ) : (
            ""
          )}

          <h2>Company Primary Contact</h2>
          <Typography>{`${companyInfo?.primaryContact.firstName} ${companyInfo?.primaryContact.lastName}`}</Typography>
          <Typography>Email: {companyInfo?.primaryContact.email}</Typography>
          <Typography>{`Primary Phone: ${companyInfo?.primaryContact.phone1} ${
            companyInfo?.primaryContact.phone1Extension
              ? `Ext: ${companyInfo?.primaryContact.phone1Extension}`
              : ""
          }`}</Typography>
          <Typography>{companyInfo?.primaryContact.countryCode}</Typography>
          <Typography>{companyInfo?.primaryContact.provinceCode}</Typography>
          <Typography>{companyInfo?.primaryContact.city}</Typography>
        </Box>
        <div>
          <Button
            variant="contained"
            color="tertiary"
            sx={{ marginTop: "20px" }}
            onClick={() => setIsEditting(true)}
          >
            <i className="fa fa-pencil" style={{ marginRight: "7px" }}></i>
            Edit
          </Button>
        </div>
      </div>
    );
  }
);

DisplayInfo.displayName = "DisplayInfo";
