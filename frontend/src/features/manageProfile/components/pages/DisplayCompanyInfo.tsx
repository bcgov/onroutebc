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
          <Typography>{companyInfo?.companyAddress.country}</Typography>
          <Typography>{companyInfo?.companyAddress.province}</Typography>
          <Typography>{`${companyInfo?.companyAddress.city} ${companyInfo?.companyAddress.postalCode}`}</Typography>

          <h2>Mailing Address</h2>
          {companyInfo?.companyAddressSameAsMailingAddress ? (
            <Typography>Same as Company Address</Typography>
          ) : (
            <>
              <Typography>
                {companyInfo?.mailingAddress?.addressLine1}
              </Typography>
              <Typography>{companyInfo?.mailingAddress?.country}</Typography>
              <Typography>{companyInfo?.mailingAddress?.province}</Typography>
              <Typography>{`${companyInfo?.mailingAddress?.city} ${companyInfo?.mailingAddress?.postalCode}`}</Typography>
            </>
          )}

          <h2>Company Contact Details</h2>
          <Typography>Email: {companyInfo?.companyEmail}</Typography>
          <Typography>{`Phone: ${companyInfo?.companyPhone} ${
            companyInfo?.companyExtensionNumber
              ? `Ext: ${companyInfo?.companyExtensionNumber}`
              : ""
          }`}</Typography>
          {companyInfo?.companyFaxNumber ? (
            <Typography>Fax: {companyInfo?.companyFaxNumber}</Typography>
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
          <Typography>{companyInfo?.primaryContact.country}</Typography>
          <Typography>{companyInfo?.primaryContact.province}</Typography>
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
