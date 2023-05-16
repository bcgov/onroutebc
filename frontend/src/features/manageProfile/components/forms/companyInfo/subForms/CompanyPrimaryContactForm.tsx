import isEmail from "validator/lib/isEmail";

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
          validate: (firstName: string) =>
            firstName.length >= 1 && firstName.length <= 100
              || "First name length must be between 1-100 characters",
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
          validate: (lastName: string) =>
            lastName.length >= 1 && lastName.length <= 100
              || "Last name length must be between 1-100 characters",
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
          validate: (email: string) =>
            isEmail(email) || "Incorrect email format",
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
            validate: (phone: string) =>
              (phone.length >= 10 && phone.length <= 20)
                || "Phone number length must be between 10-20 characters",
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
          rules: { 
            required: false,
            validate: (ext?: string) =>
              (ext == null || ext === "")
                || (ext != null && ext !== "" && ext.length <= 5)
                || "Extension length must be less than 5 characters",
          },
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
          rules: { 
            required: false,
            validate: (phone2?: string) =>
              (phone2 == null || phone2 === "")
                || (phone2 != null && phone2 !== "" && phone2.length >= 10 && phone2.length <= 20)
                || "Alternate number length must be between 10-20 characters",
          },
          label: "Alternate Number",
        }}
        className="company-primary-contact-form__input company-primary-contact-form__input--left"
      />
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "primaryContact.phone2Extension",
          rules: { 
            required: false,
            validate: (ext?: string) =>
              (ext == null || ext === "")
                || (ext != null && ext !== "" && ext.length <= 5)
                || "Extension length must be less than 5 characters",
          },
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
          validate: (city: string) =>
            (city.length >= 1 && city.length <= 100)
              || "City length must be between 1-100 characters",
        },
        label: "City",
      }}
      className="company-primary-contact-form__input"
    />
  </div>
);
