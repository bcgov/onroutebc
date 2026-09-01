import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";

import "./ReviewICBCInsuranceCertificateSection.scss";
import { areValuesDifferent } from "../../../../../../common/helpers/equality";
import { Nullable } from "../../../../../../common/types/common";
import { PERMIT_TYPES, PermitType } from "../../../../types/PermitType";
import { DiffChip } from "./DiffChip";

export const ReviewICBCInsuranceCertificateSection = ({
  permitType,
  haveCertificate,
  oldHaveCertificate,
  showChangedFields = false,
}: {
  permitType?: Nullable<PermitType>;
  haveCertificate: boolean;
  oldHaveCertificate: boolean;
  showChangedFields?: boolean;
}) => {
  const changedFields = showChangedFields
    ? {
        clf: areValuesDifferent(haveCertificate, oldHaveCertificate),
      }
    : {
        clf: false,
      };

  const showDiffChip = (show: boolean) => {
    return show ? <DiffChip /> : null;
  };

  const showSection = permitType === PERMIT_TYPES.HC;
  
  return showSection ? (
    <Box className="review-icbc-insurance-certificate-section">
      <Box className="review-icbc-insurance-certificate-section__header">
        <Typography
          variant={"h3"}
          className="review-icbc-insurance-certificate-section__title"
        >
          ICBC Certificate of Insurance
        </Typography>
      </Box>

      <Box className="review-icbc-insurance-certificate-section__body">
        <Box className="have-certificate">
          <h4 className="have-certificate__header">
            Do you have an ICBC Certificate of Insurance for Crossing Permit (MV1805/APV36)?
          </h4>

          <RadioGroup
            className="have-certificate__radio-group"
            defaultValue={haveCertificate}
            value={haveCertificate}
          >
            <FormControlLabel
              key="have-certificate-no"
              className="have-certificate__option have-certificate__option--no"
              classes={{
                label: "have-certificate__label",
              }}
              label="No"
              value={false}
              control={
                <Radio
                  key="have-certificate-radio-no"
                  className="have-certificate__radio"
                  disabled={true}
                  readOnly={true}
                />}
            />

            <FormControlLabel
              key="have-certificate-yes"
              className="have-certificate__option have-certificate__option--yes"
              classes={{
                label: "have-certificate__label",
              }}
              label="Yes"
              value={true}
              control={
                <Radio
                  key="have-certificate-radio-yes"
                  className="have-certificate__radio"
                  disabled={true}
                  readOnly={true}
                />}
            />

            {showDiffChip(changedFields.clf)}
          </RadioGroup>
        </Box>
      </Box>
    </Box>
  ) : null;
};
