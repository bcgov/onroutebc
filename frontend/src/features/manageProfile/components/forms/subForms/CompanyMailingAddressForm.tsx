import { Typography } from "@mui/material";
import { useState } from "react";
import { CountryAndProvince } from "../../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../../common/components/form/CustomFormComponents";
import { CITY_WIDTH, POSTAL_WIDTH } from "../../../../../themes/bcGovStyles";
import { CompanyProfile } from "../../../types/manageProfile";

export const CompanyMailingAddressForm = ({
  feature,
  companyInfo,
}: {
  feature: string;
  companyInfo?: CompanyProfile;
}) => {
  const [showMailingAddress,] = useState();

  return (
    <>
      {
        <>
          <Typography variant="h2" gutterBottom>
            Company Mailing Address
          </Typography>

          <CustomFormComponent
            type="input"
            feature={feature}
            options={{
              name: "mailingAddress.addressLine1",
              rules: {
                required: { value: true, message: "Address is required" },
              },
              label: "Address (Line 1)",
            }}
          />
          <CustomFormComponent
            type="input"
            feature={feature}
            options={{
              name: "mailingAddress.addressLine2",
              rules: { required: false },
              label: "Address (Line 2)",
            }}
          />
          <CountryAndProvince
            feature={feature}
            countryField="mailingAddress.countryCode"
            isCountryRequired={showMailingAddress}
            provinceField="mailingAddress.provinceCode"
            isProvinceRequired={showMailingAddress}
          />
          <div className="mp-side-by-side-container">
            <CustomFormComponent
              type="input"
              feature={feature}
              options={{
                name: "mailingAddress.city",
                rules: {
                  required: { value: true, message: "City is required" },
                },
                label: "City",
                width: CITY_WIDTH,
              }}
            />
            <CustomFormComponent
              type="input"
              feature={feature}
              options={{
                name: "mailingAddress.postalCode",
                rules: {
                  required: {
                    value: true,
                    message: "Postal / Zip Code is required",
                  },
                },
                label: "Postal / Zip Code",
                width: POSTAL_WIDTH,
              }}
            />
          </div>
        </>
      }
    </>
  );
};
