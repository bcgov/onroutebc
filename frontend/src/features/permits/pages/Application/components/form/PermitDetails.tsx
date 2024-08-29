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
import { ONROUTE_WEBPAGE_LINKS } from "../../../../../../routes/constants";
import { CustomExternalLink } from "../../../../../../common/components/links/CustomExternalLink";
import { BANNER_MESSAGES } from "../../../../../../common/constants/bannerMessages";
import { getExpiryDate } from "../../../../helpers/permitState";
import { calculateFeeByDuration } from "../../../../helpers/feeSummary";
import { PermitType } from "../../../../types/PermitType";
import { PermitCondition } from "../../../../types/PermitCondition";
import {
  CustomDatePicker,
  PastStartDateStatus,
} from "../../../../../../common/components/form/subFormComponents/CustomDatePicker";

import {
  PPC_EMAIL,
  TOLL_FREE_NUMBER,
} from "../../../../../../common/constants/constants";

import {
  DATE_FORMATS,
  getStartOfDate,
} from "../../../../../../common/helpers/formatDate";

export const PermitDetails = ({
  feature,
  defaultStartDate,
  defaultDuration,
  conditionsInPermit,
  durationOptions,
  disableStartDate,
  permitType,
  pastStartDateStatus,
  includeLcvCondition,
  onSetConditions,
}: {
  feature: string;
  defaultStartDate: Dayjs;
  defaultDuration: number;
  conditionsInPermit: PermitCondition[];
  durationOptions: {
    value: number;
    label: string;
  }[];
  disableStartDate: boolean;
  permitType: PermitType;
  pastStartDateStatus: PastStartDateStatus;
  includeLcvCondition?: boolean;
  onSetConditions: (conditions: PermitCondition[]) => void;
}) => {
  const { watch, setValue } = useFormContext();

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

  useEffect(() => {
    // use setValue to explicitly set the invisible form field for expiry date
    // this needs useEffect as this form field update process is manual, and needs to happen whenever startDate and duration changes
    // also, the form field component is accepting a dayJS object
    setValue("permitData.expiryDate", dayjs(expiryDate));
    setValue("permitData.feeSummary", `${calculateFeeByDuration(permitType, duration)}`);
  }, [startDate, duration, permitType]);

  return (
    <Box className="permit-details">
      <Box className="permit-details__header">
        <Typography variant={"h3"}>Permit Details</Typography>
      </Box>

      <Box className="permit-details__body">
        <Box className="permit-details__input-section">
          <CustomDatePicker
            feature={feature}
            name="permitData.startDate"
            disabled={disableStartDate}
            readOnly={disableStartDate}
            rules={{
              required: { value: true, message: requiredMessage() },
            }}
            label="Start Date"
            pastStartDateStatus={pastStartDateStatus}
            maxDaysInFuture={14}
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

        <Box className="permit-details__conditions">
          <Typography variant="h3" className="conditions-title">
            Select the commodities below and their respective CVSE forms.
          </Typography>

          <InfoBcGovBanner
            msg={BANNER_MESSAGES.POLICY_REMINDER}
            additionalInfo={
              <div className="conditions-info">
                <div className="conditions-info__link">
                  <CustomExternalLink
                    className="procedures-link"
                    href={ONROUTE_WEBPAGE_LINKS.COMMERCIAL_TRANSPORT_PROCEDURES}
                    openInNewTab={true}
                    withLinkIcon={true}
                  >
                    <span className="procedures-link__title">
                      Commercial Transport Procedures - Province of British
                      Columbia
                    </span>
                  </CustomExternalLink>
                </div>

                <div className="conditions-info__contact-methods">
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
            conditionsInPermit={conditionsInPermit}
            permitType={permitType}
            includeLcvCondition={includeLcvCondition}
            onSetConditions={onSetConditions}
          />
        </Box>
      </Box>
    </Box>
  );
};
