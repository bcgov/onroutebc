import { Alert, Stack, Typography } from "@mui/material";
import { CustomFormComponent } from "../../../common/components/form/CustomFormComponents";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BC_COLOURS } from "../../../themes/bcGovStyles";

/**
 * A react component containing the verify migrated client form.
 */
export const VerifyMigratedClientForm = () => {
  const FEATURE = "verify-migrated-client";
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
      <div className="create-profile-section create-profile-section--info">
        <Alert
          severity="info"
          icon={
            <FontAwesomeIcon
              icon={faCircleInfo}
              size="lg"
              color={BC_COLOURS.bc_black}
            />
          }
        >
          <Typography sx={{ fontSize: "1.125em" }}>
            <strong>
              Enter any Permit No. issued to the above Client No. in the last 7
              years
            </strong>
          </Typography>
        </Alert>
      </div>
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
