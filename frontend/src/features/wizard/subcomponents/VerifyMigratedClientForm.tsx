import { Stack } from "@mui/material";

import { CustomFormComponent } from "../../../common/components/form/CustomFormComponents";
import { InfoBcGovBanner } from "../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../common/constants/bannerMessages";
import { ORBC_FORM_FEATURES } from "../../../common/types/common";

/**
 * A react component containing the verify migrated client form.
 */
export const VerifyMigratedClientForm = () => {
  const FEATURE = ORBC_FORM_FEATURES.VERIFY_MIGRATED_CLIENT;
  return (
    <Stack spacing={3}>
      <CustomFormComponent
        type="input"
        feature={FEATURE}
        options={{
          name: "clientNumber",
          rules: {
            required: {
              value: true,
              message: "This is a required field.",
            },
          },
          label: "Client No.",
        }}
      />

      <InfoBcGovBanner
        className="create-profile-section create-profile-section--info"
        msg={BANNER_MESSAGES.ISSUED_PERMIT_NUMBER_2_YEARS}
      />

      <CustomFormComponent
        type="input"
        feature={FEATURE}
        options={{
          name: "permitNumber",
          rules: {
            required: {
              value: true,
              message: "This is a required field.",
            },
          },
          label: "Permit No.",
        }}
      />
    </Stack>
  );
};
