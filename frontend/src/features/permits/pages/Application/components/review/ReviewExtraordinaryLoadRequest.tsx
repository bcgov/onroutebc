import "./ReviewExtraordinaryLoadRequest.scss";
import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { PERMIT_TYPES, PermitType } from "../../../../types/PermitType";
import { Nullable } from "../../../../../../common/types/common";

export const ReviewExtraordinaryLoadRequest = ({
  permitType,
  isExtraordinaryLoadRequest,
  approvalNumber,
}: {
  permitType?: Nullable<PermitType>;
  isExtraordinaryLoadRequest?: Nullable<boolean>;
  approvalNumber?: Nullable<string>;
}) => {
  const showSection = permitType === PERMIT_TYPES.STOW;

  return showSection ? (
    <Box className="review-extraordinary-load-request">
      <Box className="review-extraordinary-load-request__header">
        <h3>Extraordinary Load Request</h3>
      </Box>

      <Box>
        <Box>
          <h4 className="review-extraordinary-load-request__subheader">
            Is this an extraordinary load permit application?
          </h4>

          <RadioGroup
            className="review-extraordinary-load-request__radio-group"
          >
            <FormControlLabel
              className="review-extraordinary-load-request__radio-option"
              key="is-extraordinary-load-request-no"
              label="No"
              control={
                <Radio
                  className="review-extraordinary-load-request__radio-input"
                  key="is-extraordinary-load-request-radio-no"
                  checked={!isExtraordinaryLoadRequest}
                  disabled
                />
              }
            />

            <FormControlLabel
              className="review-extraordinary-load-request__radio-option"
              key="is-extraordinary-load-request-yes"
              label="Yes"
              control={
                <Radio
                  className="review-extraordinary-load-request__radio-input"
                  key="is-extraordinary-load-request-radio-yes"
                  checked={!!isExtraordinaryLoadRequest}
                  disabled
                />
              }
            />
          </RadioGroup>
        </Box>

        {isExtraordinaryLoadRequest ? (
          <Box className="review-extraordinary-load-request__approval-number">
            <p className="approval-number__heading">
              Approval No.
            </p>
            <p className="approval-number__value">
              {approvalNumber}
            </p>
          </Box>
        ) : null}
      </Box>
    </Box>
  ) : null;
};
