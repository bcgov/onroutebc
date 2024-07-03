import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
} from "@mui/material";

import "./NoFeePermitsSection.scss";
import { RequiredOrNull } from "../../../../../common/types/common";
import { AllowedIndicator } from "../AllowedIndicator/AllowedIndicator";
import {
  NO_FEE_PERMIT_TYPES,
  NoFeePermitType,
  noFeePermitTypeDescription,
} from "../../../types/SpecialAuthorization";

export const NoFeePermitsSection = ({
  enableNoFeePermits,
  setEnableNoFeePermits,
  noFeePermitType,
  setNoFeePermitType,
  isEditable = false,
}: {
  enableNoFeePermits: boolean;
  setEnableNoFeePermits: (enable: boolean) => void;
  noFeePermitType: RequiredOrNull<NoFeePermitType>;
  setNoFeePermitType: (noFeeType: RequiredOrNull<NoFeePermitType>) => void;
  isEditable?: boolean;
}) => {
  return isEditable ? (
    <div className="no-fee-permits-section">
      <div className="no-fee-permits-section__header">
        <div className="no-fee-permits-section__title">
          No Fee Permits
        </div>

        <Switch
          className="no-fee-permits-section__enable-switch"
          checked={enableNoFeePermits}
          onChange={async (_, checked) => setEnableNoFeePermits(checked)}
        />
      </div>

      <div className="no-fee-options">
        <div className="no-fee-options__title">
          Permits are required, but no fee is charged for a vehicle owned or leased or operated by:
        </div>

        <RadioGroup
          className="no-fee-options__types"
          defaultValue={noFeePermitType}
          value={noFeePermitType}
          onChange={(e) => setNoFeePermitType(Number(e.target.value) as NoFeePermitType)}
        >
          {Object.values(NO_FEE_PERMIT_TYPES).map((noFeePermitType) => (
            <FormControlLabel
              key={noFeePermitType}
              className={`no-fee-options__type`}
              disabled={!enableNoFeePermits}
              classes={{
                label: "no-fee-options__label",
                disabled: "no-fee-options__type--disabled",
              }}
              label={noFeePermitTypeDescription(noFeePermitType)}
              value={noFeePermitType}
              control={
                <Radio
                  key={noFeePermitType}
                  className="no-fee-options__radio"
                />}
            />
          ))}
        </RadioGroup>
      </div>
    </div>
  ) : (enableNoFeePermits && noFeePermitType) ? (
    <div className="no-fee-permits-section no-fee-permits-section--readonly">
      <div className="no-fee-permits-section__header">
        <div className="no-fee-permits-section__title">
          No Fee Permits
        </div>

        <AllowedIndicator />
      </div>

      <div className="no-fee-options">
        <div className="no-fee-options__title">
          Permits are required, but no fee is charged for a vehicle owned or leased or operated by:
        </div>

        <RadioGroup
          className="no-fee-options__types"
          defaultValue={noFeePermitType}
          value={noFeePermitType}
        >
          <FormControlLabel
            key={noFeePermitType}
            className={`no-fee-options__type`}
            classes={{
              label: "no-fee-options__label",
            }}
            label={noFeePermitTypeDescription(noFeePermitType)}
            value={noFeePermitType}
            control={
              <Radio
                key={noFeePermitType}
                className="no-fee-options__radio"
              />}
          />
        </RadioGroup>
      </div>
    </div>
  ) : null;
};
