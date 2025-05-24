import { Box, RadioGroup } from "@mui/material";

import "./ConditionalLicensingFeeSection.scss";
import { Nullable, RequiredOrNull } from "../../../../../../../common/types/common";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { ConditionalLicensingFeeOption } from "../../common/ConditionalLicensingFeeOption";
import {
  CONDITIONAL_LICENSING_FEE_TYPES,
  ConditionalLicensingFeeType,
} from "../../../../../types/ConditionalLicensingFee";

export const ConditionalLicensingFeeSection = ({
  permitType,
  conditionalLicensingFeeType,
  availableCLFs,
  onChange,
}: {
  permitType: PermitType;
  conditionalLicensingFeeType?: Nullable<ConditionalLicensingFeeType>;
  availableCLFs: ConditionalLicensingFeeType[];
  onChange: (updatedConditionalLicensingFeeType: RequiredOrNull<ConditionalLicensingFeeType>) => void;
}) => {
  const showSection = ([
    PERMIT_TYPES.NRSCV,
    PERMIT_TYPES.NRQCV,
  ] as PermitType[]).includes(permitType);

  return showSection ? (
    <div className="conditional-licensing-fee-section">
      <Box className="conditional-licensing-fee-section__header">
        <h3 className="conditional-licensing-fee-section__title">
          Conditional Licensing Fee
        </h3>
      </Box>

      <Box className="conditional-licensing-fee-section__body">
        <RadioGroup
          className="conditional-licensing-fee-section__radio-group"
          defaultValue={conditionalLicensingFeeType}
          value={conditionalLicensingFeeType}
          onChange={(e) => onChange(e.target.value as ConditionalLicensingFeeType)}
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
            disabled={!availableCLFs.includes(CONDITIONAL_LICENSING_FEE_TYPES.NONE)}
            clf={CONDITIONAL_LICENSING_FEE_TYPES.NONE}
          />

          <ConditionalLicensingFeeOption
            classes={{
              root: "conditional-licensing-fee-type",
              radio: "conditional-licensing-fee-type__radio",
              disabled: "conditional-licensing-fee-type--disabled",
              label: {
                root: "conditional-licensing-fee-type__label-row",
                label: "conditional-licensing-fee-type__label",
                link: "conditional-licensing-fee-type__link"
              },
            }}
            disabled={!availableCLFs.includes(CONDITIONAL_LICENSING_FEE_TYPES.CONDITIONAL_LICENSING_FEE_RATE)}
            clf={CONDITIONAL_LICENSING_FEE_TYPES.CONDITIONAL_LICENSING_FEE_RATE}
          />

          <ConditionalLicensingFeeOption
            classes={{
              root: "conditional-licensing-fee-type",
              radio: "conditional-licensing-fee-type__radio",
              disabled: "conditional-licensing-fee-type--disabled",
              label: {
                root: "conditional-licensing-fee-type__label-row",
                label: "conditional-licensing-fee-type__label",
                link: "conditional-licensing-fee-type__link"
              },
            }}
            disabled={!availableCLFs.includes(CONDITIONAL_LICENSING_FEE_TYPES.INDUSTRIAL_X_PLATE_TYPE_FEE_RATE)}
            clf={CONDITIONAL_LICENSING_FEE_TYPES.INDUSTRIAL_X_PLATE_TYPE_FEE_RATE}
          />

          <ConditionalLicensingFeeOption
            classes={{
              root: "conditional-licensing-fee-type",
              radio: "conditional-licensing-fee-type__radio",
              disabled: "conditional-licensing-fee-type--disabled",
              label: {
                root: "conditional-licensing-fee-type__label-row",
                label: "conditional-licensing-fee-type__label",
                link: "conditional-licensing-fee-type__link"
              },
            }}
            disabled={!availableCLFs.includes(CONDITIONAL_LICENSING_FEE_TYPES.FARM_VEHICLE_FEE_RATE)}
            clf={CONDITIONAL_LICENSING_FEE_TYPES.FARM_VEHICLE_FEE_RATE}
          />

          <ConditionalLicensingFeeOption
            classes={{
              root: "conditional-licensing-fee-type",
              radio: "conditional-licensing-fee-type__radio",
              disabled: "conditional-licensing-fee-type--disabled",
              label: {
                root: "conditional-licensing-fee-type__label-row",
                label: "conditional-licensing-fee-type__label",
                link: "conditional-licensing-fee-type__link"
              },
            }}
            disabled={!availableCLFs.includes(CONDITIONAL_LICENSING_FEE_TYPES.FARM_TRACTOR_FEE_RATE)}
            clf={CONDITIONAL_LICENSING_FEE_TYPES.FARM_TRACTOR_FEE_RATE}
          />
        </RadioGroup>
      </Box>
    </div>
  ) : null;
};
