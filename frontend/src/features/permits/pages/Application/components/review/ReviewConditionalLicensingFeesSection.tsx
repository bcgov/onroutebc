import { Box, RadioGroup, Typography } from "@mui/material";

import "./ReviewConditionalLicensingFeesSection.scss";
import { Nullable } from "../../../../../../common/types/common";
import { DiffChip } from "./DiffChip";
import { areValuesDifferent } from "../../../../../../common/helpers/equality";
import { ConditionalLicensingFeeOption } from "../common/ConditionalLicensingFeeOption";
import { ConditionalLicensingFeeType } from "../../../../types/ConditionalLicensingFee";

export const ReviewConditionalLicensingFeesSection = ({
  selectedCLF,
  oldCLF,
  showChangedFields = false,
}: {
  selectedCLF?: Nullable<ConditionalLicensingFeeType>;
  oldCLF?: Nullable<ConditionalLicensingFeeType>;
  showChangedFields?: boolean;
}) => {
  const changedFields = showChangedFields
    ? {
        clf: areValuesDifferent(selectedCLF, oldCLF),
      }
    : {
        clf: false,
      };

  const showDiffChip = (show: boolean) => {
    return show ? <DiffChip /> : null;
  };
  
  return selectedCLF ? (
    <Box className="review-conditional-licensing-fees-section">
      <Box className="review-conditional-licensing-fees-section__header">
        <Typography
          variant={"h3"}
          className="review-conditional-licensing-fees-section__title"
        >
          Conditional Licensing Fees
        </Typography>
      </Box>

      <Box className="review-conditional-licensing-fees-section__body">
        <RadioGroup
          className="review-conditional-licensing-fees-section__radio-group"
          defaultValue={selectedCLF}
        >
          <ConditionalLicensingFeeOption
            classes={{
              root: "conditional-licensing-fee-type conditional-licensing-fee-type--none",
              radio: "conditional-licensing-fee-type__radio",
              disabled: "conditional-licensing-fee-type--disabled",
              label: {
                root: "conditional-licensing-fee-type__label-row",
                label: "conditional-licensing-fee-type__label",
              },
            }}
            disabled={true}
            clf={selectedCLF}
          />
        </RadioGroup>

        {showDiffChip(changedFields.clf)}
      </Box>
    </Box>
  ) : null;
};
