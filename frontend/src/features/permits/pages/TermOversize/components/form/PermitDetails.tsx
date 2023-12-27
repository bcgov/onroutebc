import { Box, MenuItem, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";

import "./PermitDetails.scss";
import { InfoBcGovBanner } from "../../../../../../common/components/banners/InfoBcGovBanner";
import { PermitExpiryDateBanner } from "../../../../../../common/components/banners/PermitExpiryDateBanner";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import { PHONE_WIDTH } from "../../../../../../themes/bcGovStyles";
import { ConditionsTable } from "./ConditionsTable";
import { requiredMessage } from "../../../../../../common/helpers/validationMessages";
import { Commodities } from "../../../../types/application";
import { ONROUTE_WEBPAGE_LINKS } from "../../../../../../routes/constants";
import { CustomExternalLink } from "../../../../../../common/components/links/CustomExternalLink";
import { BANNER_MESSAGES } from "../../../../../../common/constants/bannerMessages";
import {
  PPC_EMAIL,
  TOLL_FREE_NUMBER,
} from "../../../../../../common/constants/constants";
import {
  DATE_FORMATS,
  getStartOfDate,
} from "../../../../../../common/helpers/formatDate";
import { getExpiryDate } from "../../../../helpers/permitState";

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
  const startDate = getStartOfDate(rawStartDate);
  const expiryDate = getExpiryDate(startDate, duration);

  // Formatted expiry date is just a derived value, and always reflects latest value of expiry date
  // no need to use useState nor place inside useEffect
  const formattedExpiryDate = dayjs(expiryDate).format(DATE_FORMATS.SHORT);

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
    <Box className="permit-details">
      <Box className="permit-details__header">
        <Typography variant={"h3"}>Permit Details</Typography>
      </Box>

      <Box className="permit-details__body">
        <Box className="permit-details__input-section">
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

        <Box className="permit-details__commodities">
          <Typography variant="h3" className="commodities-title">
            Select the commodities below and their respective CVSE forms.
          </Typography>

          <InfoBcGovBanner
            msg={BANNER_MESSAGES.POLICY_REMINDER}
            additionalInfo={
              <div className="commodities-info">
                <div className="commodities-info__link">
                  <CustomExternalLink
                    className="procedures-link"
                    href={ONROUTE_WEBPAGE_LINKS.COMMERCIAL_TRANSPORT_PROCEDURES}
                    withLinkIcon={true}
                  >
                    <span className="procedures-link__title">
                      Commercial Transport Procedures - Province of British
                      Columbia
                    </span>
                  </CustomExternalLink>
                </div>

                <div className="commodities-info__contact-methods">
                  For further assistance please contact the Provincial Permit
                  Centre at{" "}
                  <span className="contact-info contact-info--toll-free">
                    Toll-free: {TOLL_FREE_NUMBER}
                  </span>{" "}
                  or{" "}
                  <span className="contact-info contact-info--email">
                    Email: {PPC_EMAIL}
                  </span>
                </div>
              </div>
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
