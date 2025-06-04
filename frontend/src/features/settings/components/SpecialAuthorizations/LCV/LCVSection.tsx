import { Switch } from "@mui/material";

import "./LCVSection.scss";
import { AllowedIndicator } from "../AllowedIndicator/AllowedIndicator";

export const LCVSection = ({
  LCVEnabled,
  onUpdateLCV,
  canUpdateLCV,
}: {
  LCVEnabled: boolean;
  onUpdateLCV: (enable: boolean) => void;
  canUpdateLCV: boolean;
}) => {
  return canUpdateLCV || LCVEnabled ? (
    <div
      className={`lcv-section ${canUpdateLCV ? "" : "lcv-section--readonly"}`}
    >
      <div className="lcv-section__header">
        <div className="lcv-section__title">Long Combination Vehicle (LCV)</div>

        {canUpdateLCV ? (
          <Switch
            className="lcv-section__enable-switch"
            checked={LCVEnabled}
            onChange={async (_, checked) => onUpdateLCV(checked)}
          />
        ) : (
          <AllowedIndicator />
        )}
      </div>

      <div className="lcv-info">
        Carrier meets the requirements to operate LCVs in BC.
      </div>
    </div>
  ) : null;
};
