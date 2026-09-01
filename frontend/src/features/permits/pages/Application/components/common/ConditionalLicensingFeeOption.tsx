import { FormControlLabel, Radio } from "@mui/material";

import { Optional } from "../../../../../../common/types/common";
import { ConditionalLicensingFeeType } from "../../../../types/ConditionalLicensingFee";
import { ConditionalLicensingFeeLabel } from "./ConditionalLicensingFeeLabel";

export const ConditionalLicensingFeeOption = ({
  classes,
  disabled,
  clf,
}: {
  classes: {
    root: string;
    radio?: Optional<string>;
    label?: {
      root: string;
      label?: Optional<string>;
      link?: Optional<string>;
    };
    disabled?: Optional<string>;
  };
  disabled?: Optional<boolean>;
  clf: ConditionalLicensingFeeType;
}) => {
  return (
    <FormControlLabel
      key={clf}
      className={classes.root}
      disabled={disabled}
      classes={{
        disabled: classes.disabled,
        label: classes.label?.root,
      }}
      label={
        <ConditionalLicensingFeeLabel
          clf={clf}
          classes={{
            label: classes.label?.label,
            link: classes.label?.link,
          }}
        />
      }
      value={clf}
      control={
        <Radio
          key={clf}
          className={classes.radio}
        />}
    />
  );
};
