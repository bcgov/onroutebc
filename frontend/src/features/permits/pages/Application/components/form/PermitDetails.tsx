import { Box, MenuItem } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

import "./PermitDetails.scss";
import { InfoBcGovBanner } from "../../../../../../common/components/banners/InfoBcGovBanner";
import { PermitExpiryDateBanner } from "../../../../../../common/components/banners/PermitExpiryDateBanner";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import { ConditionsTable } from "./ConditionsTable";
import { invalidMaxStartDate, requiredMessage, warnPastStartDate } from "../../../../../../common/helpers/validationMessages";
import { ONROUTE_WEBPAGE_LINKS } from "../../../../../../routes/constants";
import { CustomExternalLink } from "../../../../../../common/components/links/CustomExternalLink";
import { BANNER_MESSAGES } from "../../../../../../common/constants/bannerMessages";
import { PermitCondition } from "../../../../types/PermitCondition";
import { DATE_FORMATS, now } from "../../../../../../common/helpers/formatDate";
import { isQuarterlyPermit, PERMIT_TYPES, PermitType } from "../../../../types/PermitType";
import { Optional, ORBCFormFeatureType } from "../../../../../../common/types/common";
import {
  CustomDatePicker,
  PAST_START_DATE_STATUSES,
  PastStartDateStatus,
} from "../../../../../../common/components/form/subFormComponents/CustomDatePicker";

import {
  PPC_EMAIL,
  TOLL_FREE_NUMBER,
} from "../../../../../../common/constants/constants";

export const PermitDetails = ({
  feature,
  permitType,
  startDate,
  minAllowedPastStartDate,
  maxAllowedFutureStartDate,
  maxNumDaysAllowedInFuture,
  expiryDate,
  allConditions,
  durationOptions,
  pastStartDateStatus,
  onSetConditions,
}: {
  feature: ORBCFormFeatureType;
  permitType: PermitType;
  startDate: Dayjs;
  minAllowedPastStartDate?: Optional<Dayjs>;
  maxAllowedFutureStartDate: Dayjs;
  maxNumDaysAllowedInFuture: number;
  expiryDate: Dayjs;
  allConditions: PermitCondition[];
  durationOptions: {
    value: number;
    label: string;
  }[];
  pastStartDateStatus: PastStartDateStatus;
  onSetConditions: (conditions: PermitCondition[]) => void;
}) => {
  const formattedExpiryDate = dayjs(expiryDate).format(DATE_FORMATS.SHORT);

  const showSingleRoundTripInfoBanner = ([
    PERMIT_TYPES.STFR,
    PERMIT_TYPES.NRSCV,
    PERMIT_TYPES.NRQCV,
  ] as PermitType[]).includes(permitType);

  const showValidQuarterInfoBanner = permitType === PERMIT_TYPES.QRFR;

  const startDateWarningMessage =
    now().isAfter(startDate, "day") &&
    pastStartDateStatus === PAST_START_DATE_STATUSES.WARNING
      ? warnPastStartDate()
      : null;

  return (
    <Box className="permit-details">
      <Box className="permit-details__header">
        <h3>Permit Details</h3>
      </Box>

      <Box className="permit-details__body">
        {showSingleRoundTripInfoBanner ? (
          <InfoBcGovBanner
            className="permit-details__info-banner--top"
            msg={BANNER_MESSAGES.PERMIT_SINGLE_ROUND_TRIP}
          />
        ) : null}

        {showValidQuarterInfoBanner ? (
          <InfoBcGovBanner
            className="permit-details__info-banner--top"
            msg={BANNER_MESSAGES.PERMIT_START_DATE_VALID_QUARTER}
          />
        ) : null}

        <Box className="permit-details__date-selection">
          <CustomDatePicker
            className="permit-details__input permit-details__input--start-date"
            feature={feature}
            name="permitData.startDate"
            rules={{
              required: { value: true, message: requiredMessage() },
            }}
            label="Start Date"
            pastStartDateStatus={pastStartDateStatus}
            minAllowablePastDate={minAllowedPastStartDate}
            maxAllowableFutureDate={maxAllowedFutureStartDate}
            dateWarningMessage={startDateWarningMessage}
            futureDateErrorMessage={invalidMaxStartDate(maxNumDaysAllowedInFuture)}
          />

          {!isQuarterlyPermit(permitType) ? (
            <CustomFormComponent
              className="permit-details__input permit-details__input--duration"
              type="select"
              feature={feature}
              options={{
                name: "permitData.permitDuration",
                rules: {
                  required: { value: true, message: requiredMessage() },
                },
                label: "Permit Duration",
              }}
              menuOptions={durationOptions.map((data) => (
                <MenuItem key={data.value} value={data.value}>
                  {data.label}
                </MenuItem>
              ))}
            />
          ) : null}
        </Box>

        <PermitExpiryDateBanner expiryDate={formattedExpiryDate} />

        <Box className="permit-details__conditions">
          <h4 className="conditions-title">
            The following CVSE forms will be included in your permit
          </h4>

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
            allConditions={allConditions}
            onSetConditions={onSetConditions}
          />
        </Box>
      </Box>
    </Box>
  );
};
