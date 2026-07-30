import "./ExtraordinaryLoadRequestSection.scss";
import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { ORBCFormFeatureType } from "../../../../../../../common/types/common";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { CustomFormComponent } from "../../../../../../../common/components/form/CustomFormComponents";
import { requiredMessage } from "../../../../../../../common/helpers/validationMessages";

export const ExtraordinaryLoadRequestSection = ({
  feature,
  permitType,
  isExtraordinaryLoadRequest,
  onSetIsExtraordinaryLoadRequest,
}: {
  feature: ORBCFormFeatureType;
  permitType: PermitType;
  isExtraordinaryLoadRequest: boolean;
  onSetIsExtraordinaryLoadRequest: (
    updatedisExtraordinaryLoadRequest: boolean,
  ) => void;
}) => {
  const showSection = permitType === PERMIT_TYPES.STOW;

  return showSection ? (
    <Box className="extraordinary-load-request-section">
      <Box className="extraordinary-load-request-section__header">
        <h3>Extraordinary Load Request</h3>
      </Box>

      <Box>
        <Box>
          <h4 className="extraordinary-load-request-section__subheader">
            Is this an extraordinary load permit application?
          </h4>

          <RadioGroup
            className="extraordinary-load-request-section__radio-group"
            defaultValue={isExtraordinaryLoadRequest}
            value={isExtraordinaryLoadRequest}
            onChange={(e) =>
              onSetIsExtraordinaryLoadRequest(e.target.value === "true")
            }
          >
            <FormControlLabel
              key="is-extraordinary-load-request-no"
              label="No"
              value={false}
              control={<Radio key="is-extraordinary-load-request-radio-no" />}
            />

            <FormControlLabel
              key="is-extraordinary-load-request-yes"
              label="Yes"
              value={true}
              control={<Radio key="is-extraordinary-load-request-radio-yes" />}
            />
          </RadioGroup>
        </Box>

        {isExtraordinaryLoadRequest ? (
          <CustomFormComponent
            className="extraordinary-load-request-section__input"
            type="input"
            feature={feature}
            options={{
              name: "permitData.extraordinaryLoadRequest.approvalNumber",
              rules: {
                required: { value: true, message: requiredMessage() },
              },
              label: "Approval No.",
            }}
          />
        ) : null}
      </Box>
    </Box>
  ) : null;
};
