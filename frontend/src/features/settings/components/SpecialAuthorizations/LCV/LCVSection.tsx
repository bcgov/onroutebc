import { Switch } from "@mui/material";

import "./LCVSection.scss";
import { AllowedIndicator } from "../AllowedIndicator/AllowedIndicator";

export const LCVSection = ({
  enableLCV,
  setEnableLCV,
  isEditable = false,
}: {
  enableLCV: boolean;
  setEnableLCV: (enable: boolean) => void;
  isEditable?: boolean;
}) => {
  return (isEditable || enableLCV) ? (
    <div className={`lcv-section ${isEditable ? "" : "lcv-section--readonly"}`}>
      <div className="lcv-section__header">
        <div className="lcv-section__title">
          Long Combination Vehicle (LCV)
        </div>

        {isEditable ? (
          <Switch
            className="lcv-section__enable-switch"
            checked={enableLCV}
            onChange={async (_, checked) => setEnableLCV(checked)}
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
