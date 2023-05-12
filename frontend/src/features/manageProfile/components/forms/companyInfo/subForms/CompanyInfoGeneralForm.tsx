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
        rules: { required: false },
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
          },
          label: "Postal / Zip Code",
        }}
        className="company-info-general-form__input company-info-general-form__input--right"
      />
    </div>
  </div>
);
