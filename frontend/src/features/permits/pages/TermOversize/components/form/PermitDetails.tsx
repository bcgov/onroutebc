import { Box, MenuItem, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";

import { InfoBcGovBanner } from "../../../../../../common/components/banners/AlertBanners";
import { PermitExpiryDateBanner } from "../../../../../../common/components/banners/PermitExpiryDateBanner";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import { PHONE_WIDTH } from "../../../../../../themes/bcGovStyles";
import { ConditionsTable } from "./ConditionsTable";
import { requiredMessage } from "../../../../../../common/helpers/validationMessages";
import { Commodities } from "../../../../types/application";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../../../themes/orbcStyles";

export const PermitDetails = ({
  feature,
  defaultStartDate,
  defaultDuration,
  commodities,
  applicationNumber,
  durationOptions,
  disableStartDate,
}: {
  feature: string;
  defaultStartDate: Dayjs;
  defaultDuration: number;
  commodities: Commodities[];
  applicationNumber?: string;
  durationOptions: {
    value: number;
    label: string;
  }[];
  disableStartDate?: boolean;
}) => {
  const { watch, register, setValue } = useFormContext();

  // watch() is subscribed to fields, and will always have the latest values from the fields
  // thus, no need to use this in useState and useEffect
  const rawStartDate = watch("permitData.startDate");
  const duration = watch("permitData.permitDuration");

  // Permit expiry date === Permit start date + Permit duration - 1
  const startDate = dayjs(rawStartDate)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  const expiryDate = dayjs(startDate).add(duration - 1, "day");

  // handle leap year - if the given year is a leap year, and our
  // expiry date is any month other then January, add 1 day back
  if (
    expiryDate.isLeapYear() &&
    expiryDate.isAfter(expiryDate.year() + "01-31", "month")
  ) {
    expiryDate.add(1, "day");
  }

  // Formatted expiry date is just a derived value, and always reflects latest value of expiry date
  // no need to use useState nor place inside useEffect
  const formattedExpiryDate = dayjs(expiryDate).format("LL");

  useEffect(() => {
    // We do need to check if the root form default values (which are from ApplicationContext) are changed,
    // as watch() doesn't capture when defaultValues are changed
    // This will explicitly update the startDate and permitDuration fields, and in turn trigger the next useEffect
    setValue("permitData.startDate", dayjs(defaultStartDate));
    setValue("permitData.permitDuration", defaultDuration);
  }, [defaultStartDate, defaultDuration]);

  register("permitData.expiryDate");
  useEffect(() => {
    // use setValue to explicitly set the invisible form field for expiry date
    // this needs useEffect as this form field update process is manual, and needs to happen whenever startDate and duration changes
    // also, the form field component is accepting a dayJS object
    setValue("permitData.expiryDate", dayjs(expiryDate));
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
            disabled={disableStartDate}
            readOnly={disableStartDate}
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
            menuOptions={durationOptions.map((data) => (
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
          <ConditionsTable
            commodities={commodities}
            applicationWasCreated={
              applicationNumber != null && applicationNumber !== ""
            }
          />
        </Box>
      </Box>
    </Box>
  );
};
