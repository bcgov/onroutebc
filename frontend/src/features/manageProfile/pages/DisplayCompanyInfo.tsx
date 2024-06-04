import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Typography } from "@mui/material";
import { memo } from "react";

import "./DisplayCompanyInfo.scss";
import { getUserEmailFromSession } from "../../../common/apiManager/httpRequestHandler";
import { ROLES } from "../../../common/authentication/types";
import { DoesUserHaveRoleWithContext } from "../../../common/authentication/util";
import { formatPhoneNumber } from "../../../common/components/form/subFormComponents/PhoneNumberInput";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { CompanyProfile } from "../types/manageProfile";
import {
  formatCountry,
  formatProvince,
} from "../../../common/helpers/formatCountryProvince";

// Disable any eslint for references to countries_and_states.json
/* eslint-disable @typescript-eslint/no-explicit-any */

export const DisplayInfo = memo(
  ({
    companyInfo,
    setIsEditting,
  }: {
    companyInfo?: CompanyProfile;
    setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    if (!companyInfo) return <></>;

    const userEmail = getUserEmailFromSession();
    return (
      <div className="display-company-info">
        <Box>
          {companyInfo?.alternateName && (
            <>
              <Typography variant="h3">Doing Business As (DBA)</Typography>
              <Typography>{companyInfo?.alternateName}</Typography>
            </>
          )}
          <Typography variant="h3">Company Mailing Address</Typography>
          <Typography>{companyInfo?.mailingAddress.addressLine1}</Typography>
          <Typography>
            {formatCountry(companyInfo?.mailingAddress.countryCode)}
          </Typography>
          <Typography>
            {formatProvince(
              companyInfo?.mailingAddress.countryCode,
              companyInfo?.mailingAddress.provinceCode,
            )}
          </Typography>
          <Typography>{`${companyInfo?.mailingAddress.city} ${companyInfo?.mailingAddress.postalCode}`}</Typography>

          <Typography variant="h3">Company Contact Details</Typography>
          <Typography>
            Email: {getDefaultRequiredVal("", companyInfo?.email, userEmail)}
          </Typography>
          <Typography>{`Phone: ${formatPhoneNumber(companyInfo?.phone)} ${
            companyInfo?.extension ? `Ext: ${companyInfo?.extension}` : ""
          }`}</Typography>
          {companyInfo?.fax ? (
            <Typography>Fax: {formatPhoneNumber(companyInfo?.fax)}</Typography>
          ) : (
            ""
          )}

          <Typography variant="h3">Company Primary Contact</Typography>
          <Typography>{`${companyInfo?.primaryContact.firstName} ${companyInfo?.primaryContact.lastName}`}</Typography>
          <Typography>
            Email:{" "}
            {getDefaultRequiredVal("", companyInfo?.primaryContact?.email)}
          </Typography>
          <Typography>{`Primary Phone: ${formatPhoneNumber(
            companyInfo?.primaryContact.phone1,
          )} ${
            companyInfo?.primaryContact.phone1Extension
              ? `Ext: ${companyInfo?.primaryContact.phone1Extension}`
              : ""
          }`}</Typography>
          <Typography>
            {formatCountry(companyInfo?.primaryContact.countryCode)}
          </Typography>
          <Typography>
            {formatProvince(
              companyInfo?.primaryContact.countryCode,
              companyInfo?.primaryContact.provinceCode,
            )}
          </Typography>
          <Typography>{companyInfo?.primaryContact.city}</Typography>
        </Box>
        {DoesUserHaveRoleWithContext(ROLES.WRITE_ORG) && (
          <div className="display-company-info__edit">
            <Button
              variant="contained"
              color="tertiary"
              sx={{ marginTop: "20px" }}
              onClick={() => setIsEditting(true)}
            >
              <FontAwesomeIcon icon={faPencil} style={{ marginRight: "7px" }} />
              Edit
            </Button>
          </div>
        )}
      </div>
    );
  },
);

DisplayInfo.displayName = "DisplayInfo";
