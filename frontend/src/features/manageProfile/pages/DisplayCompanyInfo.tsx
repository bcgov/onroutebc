import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Typography } from "@mui/material";
import { memo } from "react";

import "./DisplayCompanyInfo.scss";
import { getUserEmailFromSession } from "../../../common/apiManager/httpRequestHandler";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { CompanyProfile } from "../types/manageProfile";
import { getProvinceFullName } from "../../../common/helpers/countries/getProvinceFullName";
import { getCountryFullName } from "../../../common/helpers/countries/getCountryFullName";
import { Nullable } from "../../../common/types/common";
import { getFormattedPhoneNumber } from "../../../common/helpers/phone/getFormattedPhoneNumber";
import { usePermissionMatrix } from "../../../common/authentication/PermissionMatrix";

export const DisplayInfo = memo(
  ({
    companyInfo,
    setIsEditting,
  }: {
    companyInfo?: CompanyProfile;
    setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const userEmail = getUserEmailFromSession();
    const mailingCountry = getCountryFullName(
      companyInfo?.mailingAddress?.countryCode,
    );
    const mailingProvince = getProvinceFullName(
      companyInfo?.mailingAddress?.countryCode,
      companyInfo?.mailingAddress?.provinceCode,
    );

    const primaryContactCountry = getCountryFullName(
      companyInfo?.primaryContact?.countryCode,
    );
    const primaryContactProvince = getProvinceFullName(
      companyInfo?.primaryContact?.countryCode,
      companyInfo?.primaryContact?.provinceCode,
    );

    const phoneDisplay = (phone: string, ext?: Nullable<string>) => {
      const extDisplay = ext ? `Ext: ${ext}` : "";
      return `${getFormattedPhoneNumber(phone)} ${extDisplay}`;
    };

    const enableEditCompanyInformationButton = usePermissionMatrix({
      permissionMatrixKeys: {
        permissionMatrixFeatureKey: "MANAGE_PROFILE",
        permissionMatrixFunctionKey: "EDIT_COMPANY_INFORMATION",
      },
    });

    return companyInfo ? (
      <div className="display-company-info">
        <Box>
          {companyInfo.alternateName ? (
            <>
              <Typography variant="h3">Doing Business As (DBA)</Typography>
              <Typography>{companyInfo.alternateName}</Typography>
            </>
          ) : null}

          <Typography variant="h3">Company Mailing Address</Typography>

          <Typography>{companyInfo.mailingAddress.addressLine1}</Typography>

          <Typography>{mailingCountry}</Typography>

          {mailingProvince ? <Typography>{mailingProvince}</Typography> : null}

          <Typography>
            {`${companyInfo.mailingAddress.city} ${companyInfo.mailingAddress.postalCode}`}
          </Typography>

          <Typography variant="h3">Company Contact Details</Typography>

          <Typography>
            Email: {getDefaultRequiredVal("", companyInfo.email, userEmail)}
          </Typography>

          <Typography>
            {`Phone: ${phoneDisplay(companyInfo.phone, companyInfo.extension)}`}
          </Typography>

          <Typography variant="h3">Company Primary Contact</Typography>

          <Typography>
            {`${companyInfo.primaryContact.firstName} ${companyInfo.primaryContact.lastName}`}
          </Typography>

          <Typography>
            Email: {getDefaultRequiredVal("", companyInfo.primaryContact.email)}
          </Typography>

          <Typography>
            {`Primary Phone: ${phoneDisplay(
              companyInfo.primaryContact.phone1,
              companyInfo.primaryContact.phone1Extension,
            )}`}
          </Typography>

          <Typography>{primaryContactCountry}</Typography>

          {primaryContactProvince ? (
            <Typography>{primaryContactProvince}</Typography>
          ) : null}

          <Typography>{companyInfo.primaryContact.city}</Typography>
        </Box>

        <div className="display-company-info__edit">
          <Button
            variant="contained"
            color="tertiary"
            sx={{ marginTop: "20px" }}
            onClick={() => setIsEditting(true)}
            disabled={!enableEditCompanyInformationButton}
          >
            <FontAwesomeIcon icon={faPencil} style={{ marginRight: "7px" }} />
            Edit
          </Button>
        </div>
      </div>
    ) : null;
  },
);

DisplayInfo.displayName = "DisplayInfo";
