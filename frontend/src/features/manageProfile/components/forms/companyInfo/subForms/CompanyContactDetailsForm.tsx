import isEmail from "validator/lib/isEmail";

import "./CompanyContactDetailsForm.scss";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";

export const CompanyContactDetailsForm = ({ feature }: { feature: string }) => (
  <div className="company-contact-details-form">
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "email",
        rules: { 
          required: { value: true, message: "Email is required" },
          validate: (email: string) => isEmail(email) || "Incorrect email format",
        },
        label: "Email",
      }}
      className="company-contact-details-form__input"
    />
    <div className="side-by-side-inputs">
      <CustomFormComponent
        type="phone"
        feature={feature}
        options={{
          name: "phone",
          rules: {
            required: { value: true, message: "Phone Number is required" },
            validate: (phone: string) => 
              (phone.length >= 10 && phone.length <= 20) 
                || "Phone number should be between 10-20 characters long",
          },
          label: "Phone Number",
          inputProps: { maxLength: 20 },
        }}
        className="company-contact-details-form__input company-contact-details-form__input--left"
      />
      <CustomFormComponent
        type="input"
        feature={feature}
        options={{
          name: "extension",
          rules: { 
            required: false,
            validate: (ext?: string) => 
              (ext == null || ext === "")
                || (ext != null && ext !== "" && ext.length <= 5) 
                || "Extension length should be less than 5 characters",
          },
          label: "Ext",
        }}
        className="company-contact-details-form__input company-contact-details-form__input--right"
      />
    </div>
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "fax",
        rules: { 
          required: false,
          validate: (fax?: string) =>
            (fax == null || fax === "")
              || (fax != null && fax !== "" && fax.length >= 10 && fax.length <= 20)
              || "Fax should be between 10-20 characters long",
        },
        label: "Fax",
      }}
      className="company-contact-details-form__input company-contact-details-form__input--left"
    />
  </div>
);
