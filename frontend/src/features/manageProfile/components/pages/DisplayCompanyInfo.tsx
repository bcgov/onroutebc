import { Box, Button, Typography } from "@mui/material";
import { memo } from "react";
import { formatPhoneNumber } from "../../../../common/components/form/PhoneNumberInput";
import { CompanyProfile } from "../../apiManager/manageProfileAPI";
import CountriesAndStates from "../../../../constants/countries_and_states.json";
import "./ManageProfilePages.scss";
// Disable any eslint for references to countries_and_states.json
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Converts CountryCode to Country Name using the countries_and_states.json file
 * @param countryCode
 * @returns Full name of the country
 */
const formatCountry = (countryCode: string) => {
  const countryName = CountriesAndStates.filter(
    (country: any) => country.code === countryCode
  );
  return countryName[0].name;
};

/**
 * Converts provinceCode to Province Name using the countries_and_states.json file
 * @param countryCode
 * @param provinceCode
 * @returns Full name of the province
 */
const formatProvince = (countryCode: string, provinceCode: string) => {
  const countries = CountriesAndStates.filter(
    (country: any) => country.code === countryCode
  ).flatMap((country: any) => country.states);

  const provinceName = countries.filter(
    (province: any) => province.code === provinceCode
  );
  return provinceName[0].name;
};

export const DisplayInfo = memo(
  ({
    companyInfo,
    setIsEditting,
  }: {
    companyInfo?: CompanyProfile;
    setIsEditting: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    if (!companyInfo) return <></>;
    return (
      <div className="display-info-container">
        <Box>
          <h2>Company Address</h2>
          <Typography>{companyInfo?.companyAddress.addressLine1}</Typography>
          <Typography>
            {formatCountry(companyInfo?.companyAddress.countryCode)}
          </Typography>
          <Typography>
            {formatProvince(
              companyInfo?.companyAddress.countryCode,
              companyInfo?.companyAddress.provinceCode
            )}
          </Typography>
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
                {companyInfo?.mailingAddress?.countryCode
                  ? formatCountry(companyInfo?.mailingAddress?.countryCode)
                  : ""}
              </Typography>
              <Typography>
                {companyInfo?.mailingAddress?.provinceCode
                  ? formatProvince(
                      companyInfo?.mailingAddress?.countryCode,
                      companyInfo?.mailingAddress?.provinceCode
                    )
                  : ""}
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
          <Typography>{`Phone: ${formatPhoneNumber(companyInfo?.phone)} ${
            companyInfo?.extension ? `Ext: ${companyInfo?.extension}` : ""
          }`}</Typography>
          {companyInfo?.fax ? (
            <Typography>Fax: {formatPhoneNumber(companyInfo?.fax)}</Typography>
          ) : (
            ""
          )}

          <h2>Company Primary Contact</h2>
          <Typography>{`${companyInfo?.primaryContact.firstName} ${companyInfo?.primaryContact.lastName}`}</Typography>
          <Typography>Email: {companyInfo?.primaryContact.email}</Typography>
          <Typography>{`Primary Phone: ${formatPhoneNumber(
            companyInfo?.primaryContact.phone1
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
              companyInfo?.primaryContact.provinceCode
            )}
          </Typography>
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
