import { Box, MenuItem, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { InfoBcGovBanner } from "../../../../../common/components/banners/AlertBanners";
import { PermitExpiryDateBanner } from "../../../../../common/components/banners/PermitExpiryDateBanner";
import { CustomFormComponent } from "../../../../../common/components/form/CustomFormComponents";
import { PHONE_WIDTH } from "../../../../../themes/bcGovStyles";
import { ConditionsTable } from "./ConditionsTable";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../../themes/orbcStyles";
import { TROS_PERMIT_DURATIONS } from "../../../constants/termOversizeConstants";
import dayjs from "dayjs";
import { useEffect } from "react";
import { requiredMessage } from "../../../../../common/helpers/validationMessages";

export const PermitDetails = ({ feature }: { feature: string }) => {
  const { getValues, watch, register, setValue } = useFormContext();

  const startDate = watch("permitData.startDate");
  // the permit expiry date is the permit duration minus 1 plus the <start date>
  const duration = getValues("permitData.permitDuration") - 1;

  const expiryDate = dayjs(startDate).add(duration, "day");
  const formattedExpiryDate = dayjs(expiryDate).format("LL");

  register("permitData.expiryDate");
  useEffect(() => {
    setValue("permitData.expiryDate", expiryDate);
  }, [startDate, duration]);

  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}>
          Permit Details
        </Typography>
      </Box>
      <Box sx={PERMIT_RIGHT_BOX_STYLE}>
        <Box sx={{ display: "flex", gap: "40px" }}>
          <CustomFormComponent
            type="datePicker"
            feature={feature}
            options={{
              name: "permitData.startDate",
              rules: {
                required: { value: true, message: requiredMessage() },
              },
              label: "Start Date",
              width: PHONE_WIDTH,
            }}
          />
          <CustomFormComponent
            type="select"
            feature={feature}
            options={{
              name: "permitData.permitDuration",
              rules: {
                required: { value: true, message: requiredMessage() },
              },
              label: "Permit Duration",
              width: PHONE_WIDTH,
            }}
            menuOptions={TROS_PERMIT_DURATIONS.map((data) => (
              <MenuItem key={data.value} value={data.value}>
                {data.label}
              </MenuItem>
            ))}
          />
        </Box>
        <PermitExpiryDateBanner expiryDate={formattedExpiryDate} />
        <Box>
          <Typography variant="h3">
            Select the commodities below and their respective CVSE forms.
          </Typography>
          <InfoBcGovBanner
            description="The applicant is responsible for ensuring they are following the correct conditions for each commodity they carry."
            htmlDescription={
              <p
                style={{
                  fontWeight: "normal",
                  fontSize: "16px",
                  paddingTop: "4px",
                }}
              >
                For Non-TAC vehicle permits or any further assistance please
                contact the Provincial Permit Centre at{" "}
                <b>Toll-free: 1-800-559-9688 or Email: ppcpermit@gov.bc.ca</b>
              </p>
            }
          />
          <ConditionsTable />
        </Box>
      </Box>
    </Box>
  );
};
