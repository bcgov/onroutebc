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
    const doingBusinessAs = companyInfo?.alternateName;

    const mailingAddressLine1 = companyInfo?.mailingAddress?.addressLine1;
    const mailingCountry = getCountryFullName(
      companyInfo?.mailingAddress?.countryCode,
    );
    const mailingCity = getDefaultRequiredVal(
      "",
      companyInfo?.mailingAddress?.city,
    );
    const mailingPostalCode = getDefaultRequiredVal(
      "",
      companyInfo?.mailingAddress?.postalCode,
    );
    const mailingCityAndPostalCode = `${mailingCity} ${mailingPostalCode}`;
    const mailingProvince = getProvinceFullName(
      companyInfo?.mailingAddress?.countryCode,
      companyInfo?.mailingAddress?.provinceCode,
    );
    const shouldShowMailingAddress =
      mailingAddressLine1 ||
      mailingCountry ||
      mailingCityAndPostalCode ||
      mailingProvince;

    const phoneDisplay = (phone: string, ext?: Nullable<string>) => {
      const extDisplay = ext ? `Ext: ${ext}` : "";
      return `${getFormattedPhoneNumber(phone)} ${extDisplay}`;
    };

    const userEmail = getUserEmailFromSession();
    const contactDetailsEmail = getDefaultRequiredVal(
      "",
      companyInfo?.email,
      userEmail,
    );
    const contactDetailsPhone = phoneDisplay(
      getDefaultRequiredVal("", companyInfo?.phone),
      companyInfo?.extension,
    );
    const shouldShowContactDetails = contactDetailsEmail || contactDetailsPhone;
    const primaryContactFirstName = getDefaultRequiredVal(
      "",
      companyInfo?.primaryContact?.firstName,
    );
    const primaryContactLastName = getDefaultRequiredVal(
      "",
      companyInfo?.primaryContact?.lastName,
    );
    const primaryContactFullName = `${primaryContactFirstName} ${primaryContactLastName}`;
    const primaryContactEmail = getDefaultRequiredVal(
      "",
      companyInfo?.primaryContact?.email,
    );
    const primaryContactPhone = phoneDisplay(
      getDefaultRequiredVal("", companyInfo?.primaryContact?.phone1),
      companyInfo?.primaryContact?.phone1Extension,
    );
    const primaryContactCountry = getCountryFullName(
      companyInfo?.primaryContact?.countryCode,
    );
    const primaryContactProvince = getProvinceFullName(
      companyInfo?.primaryContact?.countryCode,
      companyInfo?.primaryContact?.provinceCode,
    );
    const primaryContactCity = companyInfo?.primaryContact?.city;

    const shouldShowPrimaryContact =
      primaryContactFullName ||
      primaryContactEmail ||
      primaryContactPhone ||
      primaryContactCountry ||
      primaryContactProvince ||
      primaryContactCity;

    const enableEditCompanyInformationButton = usePermissionMatrix({
      permissionMatrixKeys: {
        permissionMatrixFeatureKey: "MANAGE_PROFILE",
        permissionMatrixFunctionKey: "EDIT_COMPANY_INFORMATION",
      },
    });

    const EmptyState = () => (
      <>
        <br />
        <br />
      </>
    );

    return companyInfo ? (
      <div className="display-company-info">
        <Box>
          <Typography variant="h3">Doing Business As (DBA)</Typography>

          {doingBusinessAs ? (
            <Typography>{doingBusinessAs}</Typography>
          ) : (
            <EmptyState />
          )}

          <Typography variant="h3">Company Mailing Address</Typography>
          {shouldShowMailingAddress ? (
            <>
              {mailingAddressLine1 && (
                <Typography>{mailingAddressLine1}</Typography>
              )}
              {mailingCountry && <Typography>{mailingCountry}</Typography>}
              {mailingProvince && <Typography>{mailingProvince}</Typography>}
              {mailingCityAndPostalCode && (
                <Typography>{mailingCityAndPostalCode}</Typography>
              )}
            </>
          ) : (
            <EmptyState />
          )}

          <Typography variant="h3">Company Contact Details</Typography>
          {shouldShowContactDetails ? (
            <>
              {contactDetailsEmail && (
                <Typography>Email: {contactDetailsEmail}</Typography>
              )}
              {contactDetailsPhone && (
                <Typography>Phone: {contactDetailsPhone}</Typography>
              )}
            </>
          ) : (
            <EmptyState />
          )}

          <Typography variant="h3">Company Primary Contact</Typography>
          {shouldShowPrimaryContact ? (
            <>
              {primaryContactFullName && (
                <Typography>{primaryContactFullName}</Typography>
              )}
              {primaryContactEmail && (
                <Typography>Email: {primaryContactEmail}</Typography>
              )}
              {primaryContactPhone && (
                <Typography>Primary Phone: {primaryContactPhone}</Typography>
              )}
              {primaryContactCountry && (
                <Typography>{primaryContactCountry}</Typography>
              )}
              {primaryContactProvince && (
                <Typography>{primaryContactProvince}</Typography>
              )}
              {primaryContactCity && (
                <Typography>{primaryContactCity}</Typography>
              )}
            </>
          ) : (
            <EmptyState />
          )}
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
