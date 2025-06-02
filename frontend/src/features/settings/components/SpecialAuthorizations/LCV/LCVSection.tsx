import { Switch } from "@mui/material";

import "./LCVSection.scss";
import { AllowedIndicator } from "../AllowedIndicator/AllowedIndicator";

export const LCVSection = ({
  LCVEnabled,
  onUpdateLCV,
  canEnableLCV,
  canDisableLCV,
}: {
  LCVEnabled: boolean;
  onUpdateLCV: (enable: boolean) => void;
  canEnableLCV: boolean;
  canDisableLCV: boolean;
}) => {
  const isEditable =
    (LCVEnabled && canDisableLCV) || (!LCVEnabled && canEnableLCV);

  return isEditable || LCVEnabled ? (
    <div className={`lcv-section ${isEditable ? "" : "lcv-section--readonly"}`}>
      <div className="lcv-section__header">
        <div className="lcv-section__title">Long Combination Vehicle (LCV)</div>

        {isEditable ? (
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
