import isEmail from "validator/lib/isEmail";

import "./CompanyContactDetailsForm.scss";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import { validatePhoneNumber } from "../../../../../../common/helpers/phone/validatePhoneNumber";
import { validatePhoneExtension } from "../../../../../../common/helpers/phone/validatePhoneExtension";
import {
  invalidEmail,
  requiredMessage,
} from "../../../../../../common/helpers/validationMessages";
import { ORBCFormFeatureType } from "../../../../../../common/types/common";

export const CompanyContactDetailsForm = ({
  feature,
}: {
  /**
   * The name of the feature that this form is part of.
   */
  feature: ORBCFormFeatureType;
}) => (
  <div className="company-contact-details-form">
    <CustomFormComponent
      type="input"
      feature={feature}
      options={{
        name: "email",
        rules: {
          required: { value: true, message: requiredMessage() },
          validate: {
            validateEmail: (email: string) => isEmail(email) || invalidEmail(),
          },
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
            required: { value: true, message: requiredMessage() },
            validate: {
              validatePhone: (phone: string) => validatePhoneNumber(phone),
            },
          },
          label: "Phone",
          inputProps: { maxLength: 20 },
        }}
        className="company-contact-details-form__input company-contact-details-form__input--left"
      />

      <CustomFormComponent
        type="ext"
        feature={feature}
        options={{
          name: "extension",
          rules: {
            required: false,
            validate: {
              validateExt: (ext?: string) => validatePhoneExtension(ext),
            },
          },
          label: "Ext",
        }}
        className="company-contact-details-form__input company-contact-details-form__input--right"
      />
    </div>
  </div>
);
