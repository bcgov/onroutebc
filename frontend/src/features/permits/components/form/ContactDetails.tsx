import { Box, Typography } from "@mui/material";
import { InfoBcGovBanner } from "../../../../common/components/banners/AlertBanners";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
  PHONE_WIDTH,
  EXT_WIDTH,
} from "../../../../themes/orbcStyles";

export const ContactDetails = ({ feature }: { feature: string }) => {
  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}>
          Contact Information
        </Typography>
      </Box>
      <Box sx={PERMIT_RIGHT_BOX_STYLE}>
        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "application.contactDetails.firstName",
            rules: {
              required: { value: true, message: "First Name is required" },
            },
            label: "First Name",
          }}
        />
        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "application.contactDetails.lastName",
            rules: {
              required: { value: true, message: "Last Name is required" },
            },
            label: "Last Name",
          }}
        />

        <div className="mp-side-by-side-container">
          <CustomFormComponent
            type="phone"
            feature={feature}
            options={{
              name: "application.contactDetails.phone1",
              rules: {
                required: { value: true, message: "Phone Number is required" },
              },
              label: "Phone Number",
              width: PHONE_WIDTH,
            }}
          />
          <CustomFormComponent
            type="input"
            feature={feature}
            options={{
              name: "application.contactDetails.phone1Extension",
              rules: { required: false },
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
              name: "application.contactDetails.phone2",
              rules: { required: false },
              label: "Alternate Number",
              width: PHONE_WIDTH,
            }}
          />
          <CustomFormComponent
            type="input"
            feature={feature}
            options={{
              name: "application.contactDetails.phone2Extension",
              rules: { required: false },
              label: "Ext",
              width: EXT_WIDTH,
            }}
          />
        </div>

        <InfoBcGovBanner
          description="The permit will be sent to the email listed below in addition to the email on your 
      onRouteBC Company Information. If you would also like to receive the permit by Fax, please enter a fax number."
        />

        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "application.contactDetails.email",
            rules: {
              required: { value: true, message: "Email is required" },
            },
            label: "Email",
          }}
        />

        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "application.contactDetails.fax",
            rules: { required: false },
            label: "Fax",
            width: PHONE_WIDTH,
          }}
        />
      </Box>
    </Box>
  );
};
