import isPostalCode from "validator/lib/isPostalCode";

import "./CompanyInfoGeneralForm.scss";
import { CountryAndProvince } from "../../../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";

export const CompanyInfoGeneralForm = ({ feature }: { feature: string }) => (
  <div className="company-info-general-form">
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "mailingAddress.addressLine1",
        rules: {
          required: { value: true, message: "Address is required" },
          validate: {
            validateAddress1: (address1: string) => 
              (address1.length >= 1 && address1.length <= 150) 
                || "Address length must be between 1-150 characters",
          },
        },
        label: "Address (Line 1)",
      }}
      className="company-info-general-form__input"
    />

    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "mailingAddress.addressLine2",
        rules: { 
          required: false,
          validate: {
            validateAddress2: (address2?: string) =>
              (address2 == null || address2 === "")
                || (address2 != null && address2 !== "" && address2.length >= 1 && address2.length <= 100)
                || "Address length must be between 1-100 characters",
          },
        },
        label: "Address (Line 2)",
      }}
      className="company-info-general-form__input"
    />

    <CountryAndProvince
      feature={feature}
      countryField="mailingAddress.countryCode"
      provinceField="mailingAddress.provinceCode"
      countryClassName="company-info-general-form__input"
      provinceClassName="company-info-general-form__input"
    />

    <div className="side-by-side-inputs">
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "mailingAddress.city",
          rules: {
            required: { value: true, message: "City is required" },
            validate: {
              validateCity: (city: string) =>
                (city.length >= 1 && city.length <= 100)
                  || "City length must be between 1-100 characters long",
            },
          },
          label: "City",
        }}
        className="company-info-general-form__input company-info-general-form__input--left"
      />
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "mailingAddress.postalCode",
          rules: {
            required: { value: true, message: "Postal / Zip Code is required" },
            validate: {
              validatePostalCode: (postalCode: string) =>
                (postalCode.length >= 5 && postalCode.length <= 7 && isPostalCode(postalCode, "any")) 
                  || "Incorrect postal code format",
            },
          },
          label: "Postal / Zip Code",
        }}
        className="company-info-general-form__input company-info-general-form__input--right"
      />
    </div>
  </div>
);
