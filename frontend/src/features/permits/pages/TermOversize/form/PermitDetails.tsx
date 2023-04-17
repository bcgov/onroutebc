import { Box, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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

export const PermitDetails = ({ feature }: { feature: string }) => {
  const permitDurations = [
    { value: 30, label: "30 Days" },
    { value: 60, label: "60 Days" },
    { value: 90, label: "90 Days" },
    { value: 120, label: "120 Days" },
    { value: 365, label: "1 Year" },
  ];

  const { getValues, watch, register, setValue } = useFormContext();

  const startDate = watch("application.startDate");
  const duration = getValues("application.permitDuration");
  const formatDate = () => {
    return startDate.add(duration, "day").format("LL");
  };

  const [expiryDate, setExpiryDate] = useState(formatDate());

  register("application.expiryDate");

  useEffect(() => {
    setExpiryDate(formatDate());
    setValue("application.expiryDate", startDate.add(duration, "day"));
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
              name: "application.startDate",
              rules: {
                required: { value: true, message: "Start Date is required." },
              },
              label: "Start Date",
              width: PHONE_WIDTH,
            }}
          />
          <CustomFormComponent
            type="select"
            feature={feature}
            options={{
              name: "application.permitDuration",
              rules: {
                required: { value: true, message: "Duration is required." },
              },
              label: "Permit Duration",
              width: PHONE_WIDTH,
            }}
            menuOptions={permitDurations.map((data) => (
              <MenuItem key={data.value} value={data.value}>
                {data.label}
              </MenuItem>
            ))}
          />
        </Box>
        <PermitExpiryDateBanner expiryDate={expiryDate} />
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
