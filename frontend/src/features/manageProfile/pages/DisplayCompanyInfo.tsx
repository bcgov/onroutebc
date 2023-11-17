import { Box, Button, Typography } from "@mui/material";
import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

import "./DisplayCompanyInfo.scss";
import { formatPhoneNumber } from "../../../common/components/form/subFormComponents/PhoneNumberInput";
import {
  formatCountry,
  formatProvince,
} from "../../../common/helpers/formatCountryProvince";
import { CompanyProfile } from "../types/manageProfile";
import { DoesUserHaveRoleWithContext } from "../../../common/authentication/util";
import { ROLES } from "../../../common/authentication/types";
import { getCompanyEmailFromSession } from "../../../common/apiManager/httpRequestHandler";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
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

    const companyEmail = getCompanyEmailFromSession();
    return (
      <div className="display-company-info">
        <Box>
          <Typography variant="h3">Mailing Address</Typography>
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
            Email: {getDefaultRequiredVal("", companyEmail, companyInfo?.email)}
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
