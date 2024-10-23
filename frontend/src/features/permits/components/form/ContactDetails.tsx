import { Box } from "@mui/material";

import "./ContactDetails.scss";
import { InfoBcGovBanner } from "../../../../common/components/banners/InfoBcGovBanner";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import { requiredMessage } from "../../../../common/helpers/validationMessages";
import { BANNER_MESSAGES } from "../../../../common/constants/bannerMessages";

export const ContactDetails = ({ feature }: { feature: string }) => {
  return (
    <Box className="contact-details-form">
      <Box className="contact-details-form__header">
        <h3>Contact Information</h3>
      </Box>

      <Box className="contact-details-form__body">
        <CustomFormComponent
          className="contact-details-form__input contact-details-form__input--first-name"
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
          className="contact-details-form__input"
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

        <div className="side-by-side-inputs">
          <CustomFormComponent
            className="side-by-side-inputs__left-input"
            type="phone"
            feature={feature}
            options={{
              name: "permitData.contactDetails.phone1",
              rules: {
                required: { value: true, message: requiredMessage() },
              },
              label: "Phone Number",
            }}
          />

          <CustomFormComponent
            className="side-by-side-inputs__right-input"
            type="input"
            feature={feature}
            options={{
              name: "permitData.contactDetails.phone1Extension",
              rules: { required: false },
              label: "Ext",
            }}
          />
        </div>

        <div className="side-by-side-inputs">
          <CustomFormComponent
            className="side-by-side-inputs__left-input"
            type="phone"
            feature={feature}
            options={{
              name: "permitData.contactDetails.phone2",
              rules: { required: false },
              label: "Alternate Number",
            }}
          />

          <CustomFormComponent
            className="side-by-side-inputs__right-input"
            type="input"
            feature={feature}
            options={{
              name: "permitData.contactDetails.phone2Extension",
              rules: { required: false },
              label: "Ext",
            }}
          />
        </div>

        <InfoBcGovBanner
          className="contact-details-form__info"
          msg={BANNER_MESSAGES.PERMIT_SEND_TO}
        />

        <CustomFormComponent
          className="contact-details-form__input contact-details-form__input--company-email"
          type="input"
          feature={feature}
          options={{
            name: "permitData.contactDetails.email",
            rules: {
              required: { value: true, message: requiredMessage() },
            },
            label: "Company Email",
          }}
          disabled={true}
          readOnly={true}
        />

        <CustomFormComponent
          className="contact-details-form__input"
          type="input"
          feature={feature}
          options={{
            name: "permitData.contactDetails.additionalEmail",
            rules: { required: false },
            label: "Additional Email",
          }}
        />

        <CustomFormComponent
          className="contact-details-form__input contact-details-form__input--fax"
          type="phone"
          feature={feature}
          options={{
            name: "permitData.contactDetails.fax",
            rules: { required: false },
            label: "Fax",
          }}
        />
      </Box>
    </Box>
  );
};
