import isEmail from "validator/lib/isEmail";

import "./CompanyContactDetailsForm.scss";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import {
  invalidEmail,
  invalidExtensionLength,
  invalidPhoneLength,
  requiredMessage,
} from "../../../../../../common/helpers/validationMessages";
import { removeNonNumericValues } from "../../../../../../common/helpers/removeNonNumericValues";

export const CompanyContactDetailsForm = ({
  feature,
  disableEmail = true,
}: {
  /**
   * The name of the feature that this form is part of.
   */
  feature: string;
  /**
   * Should the email be disabled? By default it is.
   */
  disableEmail?: boolean;
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
      disabled={disableEmail}
      readOnly={disableEmail}
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
              validatePhone: (phone: string) => {
                const filteredPhone = removeNonNumericValues(phone);
                return (
                  (filteredPhone.length >= 10 && filteredPhone.length <= 20) ||
                  invalidPhoneLength(10, 20)
                );
              },
            },
          },
          label: "Phone",
          inputProps: { maxLength: 20 },
        }}
        className="company-contact-details-form__input company-contact-details-form__input--left"
      />
      <CustomFormComponent
        type="number"
        feature={feature}
        options={{
          name: "extension",
          rules: {
            required: false,
            validate: {
              validateExt: (ext?: string) =>
                ext == null ||
                ext === "" ||
                (ext != null && ext !== "" && ext.length <= 5) ||
                invalidExtensionLength(5),
            },
          },
          label: "Ext",
        }}
        className="company-contact-details-form__input company-contact-details-form__input--right"
      />
    </div>
    <CustomFormComponent
      type="phone"
      feature={feature}
      options={{
        name: "fax",
        rules: {
          required: false,
          validate: {
            validateFax: (fax?: string) => {
              if (!fax) return;

              const filteredFax = removeNonNumericValues(fax);
              return (
                filteredFax.length === 0 ||
                (filteredFax.length >= 10 && filteredFax.length <= 20) ||
                invalidPhoneLength(10, 20)
              );
            },
          },
        },
        label: "Fax",
      }}
      className="company-contact-details-form__input company-contact-details-form__input--left"
    />
  </div>
);
