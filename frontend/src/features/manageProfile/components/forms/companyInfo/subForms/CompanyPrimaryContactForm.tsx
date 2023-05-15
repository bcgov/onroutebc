import "./CompanyPrimaryContactForm.scss";
import { CountryAndProvince } from "../../../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";

export const CompanyPrimaryContactForm = ({ feature }: { feature: string }) => (
  <div className="company-primary-contact-form">
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "primaryContact.firstName",
        rules: {
          required: { value: true, message: "First Name is required" },
        },
        label: "First Name",
      }}
      className="company-primary-contact-form__input"
    />
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "primaryContact.lastName",
        rules: {
          required: { value: true, message: "Last Name is required" },
        },
        label: "Last Name",
      }}
      className="company-primary-contact-form__input"
    />
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "primaryContact.email",
        rules: {
          required: { value: true, message: "Email is required" },
        },
        label: "Email",
      }}
      className="company-primary-contact-form__input"
    />

    <div className="side-by-side-inputs">
      <CustomFormComponent
        type="phone"
        feature={feature}
        options={{
          name: "primaryContact.phone1",
          rules: {
            required: { value: true, message: "Phone Number is required" },
          },
          label: "Phone Number",
        }}
        className="company-primary-contact-form__input company-primary-contact-form__input--left"
      />
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "primaryContact.phone1Extension",
          rules: { required: false },
          label: "Ext",
        }}
        className="company-primary-contact-form__input company-primary-contact-form__input--right"
      />
    </div>
    <div className="side-by-side-inputs">
      <CustomFormComponent
        type="phone"
        feature={feature}
        options={{
          name: "primaryContact.phone2",
          rules: { required: false },
          label: "Alternate Number",
        }}
        className="company-primary-contact-form__input company-primary-contact-form__input--left"
      />
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "primaryContact.phone2Extension",
          rules: { required: false },
          label: "Ext",
        }}
        className="company-primary-contact-form__input company-primary-contact-form__input--right"
      />
    </div>

    <CountryAndProvince
      feature={feature}
      countryField="primaryContact.countryCode"
      isCountryRequired={true}
      countryClassName="company-primary-contact-form__input"
      provinceField="primaryContact.provinceCode"
      isProvinceRequired={true}
      provinceClassName="company-primary-contact-form__input"
    />
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "primaryContact.city",
        rules: {
          required: { value: true, message: "City is required" },
        },
        label: "City",
      }}
      className="company-primary-contact-form__input"
    />
  </div>
);
