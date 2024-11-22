import { Box, Typography } from "@mui/material";

import "./ContactDetails.scss";
import { InfoBcGovBanner } from "../../../../common/components/banners/InfoBcGovBanner";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import {
  invalidEmail,
  invalidExtensionLength,
  invalidPhoneLength,
  requiredMessage,
} from "../../../../common/helpers/validationMessages";
import { PHONE_WIDTH, EXT_WIDTH } from "../../../../themes/orbcStyles";
import { BANNER_MESSAGES } from "../../../../common/constants/bannerMessages";
import isEmail from "validator/lib/isEmail";
import { removeNonNumericValues } from "../../../../common/helpers/removeNonNumericValues";

export const ContactDetails = ({ feature }: { feature: string }) => {
  return (
    <Box className="contact-details-form">
      <Box className="contact-details-form__header">
        <Typography variant={"h3"}>Contact Information</Typography>
      </Box>

      <Box className="contact-details-form__body">
        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "permitData.contactDetails.firstName",
            rules: {
              required: { value: true, message: requiredMessage() },
            },
            label: "First Name",
          }}
        />

        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "permitData.contactDetails.lastName",
            rules: {
              required: { value: true, message: requiredMessage() },
            },
            label: "Last Name",
          }}
        />

        <div className="mp-side-by-side-container">
          <CustomFormComponent
            type="phone"
            feature={feature}
            options={{
              name: "permitData.contactDetails.phone1",
              rules: {
                required: { value: true, message: requiredMessage() },
                validate: {
                  validatePhone1: (phone: string) => {
                    const filteredPhone = removeNonNumericValues(phone);
                    return (
                      (filteredPhone.length >= 10 &&
                        filteredPhone.length <= 20) ||
                      invalidPhoneLength(10, 20)
                    );
                  },
                },
              },

              label: "Phone Number",
              width: PHONE_WIDTH,
            }}
          />

          <CustomFormComponent
            type="number"
            feature={feature}
            options={{
              name: "permitData.contactDetails.phone1Extension",
              rules: {
                required: false,
                validate: {
                  validateExt1: (ext?: string) =>
                    !ext ||
                    ext.length === 0 ||
                    ext.length <= 5 ||
                    invalidExtensionLength(5),
                },
              },
              label: "Ext",
              width: EXT_WIDTH,
            }}
          />
        </div>

        <div className="mp-side-by-side-container">
          <CustomFormComponent
            type="phone"
            feature={feature}
            options={{
              name: "permitData.contactDetails.phone2",
              rules: {
                required: false,
                validate: {
                  validatePhone2: (phone?: string) => {
                    if (!phone) return;

                    const filteredPhone = removeNonNumericValues(phone);
                    return (
                      filteredPhone.length === 0 ||
                      (filteredPhone.length >= 10 &&
                        filteredPhone.length <= 20) ||
                      invalidPhoneLength(10, 20)
                    );
                  },
                },
              },
              label: "Alternate Number",
              width: PHONE_WIDTH,
            }}
          />

          <CustomFormComponent
            type="number"
            feature={feature}
            options={{
              name: "permitData.contactDetails.phone2Extension",
              rules: {
                required: false,
                validate: {
                  validateExt2: (ext?: string) =>
                    !ext ||
                    ext.length === 0 ||
                    ext.length <= 5 ||
                    invalidExtensionLength(5),
                },
              },
              label: "Ext",
              width: EXT_WIDTH,
            }}
          />
        </div>

        <InfoBcGovBanner msg={BANNER_MESSAGES.PERMIT_SEND_TO} />

        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "permitData.contactDetails.email",
            rules: {
              required: { value: true, message: requiredMessage() },
              validate: {
                validateEmail: (email: string) =>
                  isEmail(email) || invalidEmail(),
              },
            },
            label: "Company Email",
          }}
          disabled={true}
          readOnly={true}
        />

        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "permitData.contactDetails.additionalEmail",
            rules: {
              required: false,
              validate: {
                validateEmail: (email?: string) =>
                  !email ||
                  email.length === 0 ||
                  isEmail(email) ||
                  invalidEmail(),
              },
            },
            label: "Additional Email",
          }}
        />

        <CustomFormComponent
          type="phone"
          feature={feature}
          options={{
            name: "permitData.contactDetails.fax",
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
            width: PHONE_WIDTH,
          }}
        />
      </Box>
    </Box>
  );
};
