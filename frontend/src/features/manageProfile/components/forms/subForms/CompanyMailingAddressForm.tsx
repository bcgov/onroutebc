import { Typography } from "@mui/material";
import { useState } from "react";
import { CountryAndProvince } from "../../../../../common/components/form/CountryAndProvince";
import { CustomCheckbox } from "../../../../../common/components/form/CustomCheckbox";
import {
  CommonFormPropsType,
  CustomFormComponent,
} from "../../../../../common/components/form/CustomFormComponents";
import {
  DEFAULT_WIDTH,
  CITY_WIDTH,
  POSTAL_WIDTH,
} from "../../../../../themes/bcGovStyles";
import { CompanyProfile } from "../../../apiManager/manageProfileAPI";

export const CompanyMailingAddressForm = ({
  commonFormProps,
  companyInfo,
}: {
  companyInfo?: CompanyProfile;
  commonFormProps: CommonFormPropsType<CompanyProfile>;
}) => {
  const [showMailingAddress, setShowMailingAddress] = useState(
    !companyInfo?.mailingAddressSameAsCompanyAddress
  );

  return (
    <>
      <CustomCheckbox
        commonFormProps={commonFormProps}
        name="mailingAddressSameAsCompanyAddress"
        label={"Mailing address is the same as company address"}
        inputProps={{
          "aria-label": "Mailing Address Checkbox",
        }}
        checked={!showMailingAddress}
        handleOnChange={() => setShowMailingAddress(!showMailingAddress)}
      />

      {showMailingAddress ? (
        <>
          <Typography variant="h2" gutterBottom>
            Company Mailing Address
          </Typography>

          <CustomFormComponent
            type="input"
            commonFormProps={commonFormProps}
            options={{
              name: "mailingAddress.addressLine1",
              rules: { required: true },
              label: "Address (Line 1)",
              inValidMessage: "Address is required",
            }}
          />
          <CustomFormComponent
            type="input"
            commonFormProps={commonFormProps}
            options={{
              name: "mailingAddress.addressLine2",
              rules: { required: false },
              label: "Address (Line 2)",
            }}
          />
          <CountryAndProvince
            country={
              companyInfo?.mailingAddress?.countryCode
                ? companyInfo.mailingAddress.countryCode
                : ""
            }
            province={
              companyInfo?.mailingAddress?.provinceCode
                ? companyInfo.mailingAddress.provinceCode
                : ""
            }
            width={DEFAULT_WIDTH}
            countryField={"mailingAddress.countryCode"}
            provinceField={"mailingAddress.provinceCode"}
            feature={"profile"}
            rules={{ required: showMailingAddress }}
          />
          <div className="mp-side-by-side-container">
            <CustomFormComponent
              type="input"
              commonFormProps={commonFormProps}
              options={{
                name: "mailingAddress.city",
                rules: { required: true },
                label: "City",
                inValidMessage: "City is required",
                width: CITY_WIDTH,
              }}
            />
            <CustomFormComponent
              type="input"
              commonFormProps={commonFormProps}
              options={{
                name: "mailingAddress.postalCode",
                rules: { required: true },
                label: "Postal / Zip Code",
                inValidMessage: "Postal / Zip Code is required",
                width: POSTAL_WIDTH,
              }}
            />
          </div>
        </>
      ) : null}
    </>
  );
};
