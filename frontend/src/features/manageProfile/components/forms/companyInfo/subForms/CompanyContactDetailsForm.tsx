import "./CompanyContactDetailsForm.scss";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";

export const CompanyContactDetailsForm = ({ feature }: { feature: string }) => (
  <div className="company-contact-details-form">
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "email",
        rules: { required: true },
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
          rules: { required: false },
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
        rules: { required: false },
        label: "Fax",
      }}
      className="company-contact-details-form__input company-contact-details-form__input--left"
    />
  </div>
);
