import "./CompanyInfoGeneralForm.scss";
import { CountryAndProvince } from "../../../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import {
  invalidAddressLength,
  invalidCityLength,
  invalidPostalCode,
  isValidOptionalString,
  requiredMessage,
} from "../../../../../../common/helpers/validationMessages";
import { ORBCFormFeatureType } from "../../../../../../common/types/common";

export const CompanyInfoGeneralForm = ({
  feature,
}: {
  feature: ORBCFormFeatureType;
}) => {
  return (
    <div className="company-info-general-form">
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "mailingAddress.addressLine1",
          rules: {
            required: { value: true, message: requiredMessage() },
            validate: {
              validateAddress1: (address1: string) =>
                (address1.length >= 1 && address1.length <= 150) ||
                invalidAddressLength(1, 150),
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
                isValidOptionalString(address2, { maxLength: 100 }) ||
                invalidAddressLength(1, 100),
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
              required: { value: true, message: requiredMessage() },
              validate: {
                validateCity: (city: string) =>
                  (city.length >= 1 && city.length <= 100) ||
                  invalidCityLength(1, 100),
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
              required: { value: true, message: requiredMessage() },
              validate: {
                validatePostalCode: (postalCode: string) =>
                  postalCode.length <= 30 || invalidPostalCode(),
              },
            },
            label: "Postal / Zip Code",
          }}
          className="company-info-general-form__input company-info-general-form__input--right"
        />
      </div>
    </div>
  );
};
