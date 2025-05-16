import { Box, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Controller } from "react-hook-form";

import "./ConditionalLicensingFeeSection.scss";
import { Nullable } from "../../../../../../../common/types/common";
import { CONDITIONAL_LICENSING_FEE_TYPES, ConditionalLicensingFeeType } from "../../../../../types/ConditionalLicensingFee";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { CustomExternalLink } from "../../../../../../../common/components/links/CustomExternalLink";
import { CONDITIONAL_LICENSING_FEE_LINKS } from "../../../../../constants/constants";

export const ConditionalLicensingFeeSection = ({
  permitType,
  conditionalLicensingFeeType,
  availableCLFs,
  onChange,
}: {
  permitType: PermitType;
  conditionalLicensingFeeType?: Nullable<ConditionalLicensingFeeType>;
  availableCLFs: ConditionalLicensingFeeType[];
  onChange: (updatedConditionalLicensingFeeType: ConditionalLicensingFeeType) => void;
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
        <Controller
          name="permitData.conditionalLicensingFee"
          rules={{
            required: false,
          }}
          render={() => (
            <RadioGroup
              className="conditional-licensing-fee-section__radio-group"
              defaultValue={conditionalLicensingFeeType}
              value={conditionalLicensingFeeType}
              onChange={(e) => onChange(e.target.value as ConditionalLicensingFeeType)}
            >
              <div
                className={`conditional-licensing-fee-type conditional-licensing-fee-type--none ${
                  conditionalLicensingFeeType === CONDITIONAL_LICENSING_FEE_TYPES.NONE
                    ? "conditional-licensing-fee-type--active"
                    : ""
                }`}
              >
                <FormControlLabel
                  className="conditional-licensing-fee-type__label"
                  label={
                    <span className="clf-description">None</span>
                  }
                  value={CONDITIONAL_LICENSING_FEE_TYPES.NONE}
                  control={
                    <Radio
                      key="none"
                      className="conditional-licensing-fee-type__radio"
                      classes={{
                        checked: "conditional-licensing-fee-type__radio--checked",
                        disabled: "conditional-licensing-fee-type__radio--disabled",
                      }}
                      disabled={!availableCLFs.includes(CONDITIONAL_LICENSING_FEE_TYPES.NONE)}
                    />}
                />
              </div>

              <div
                className={`conditional-licensing-fee-type conditional-licensing-fee-type--conditional ${
                  conditionalLicensingFeeType === CONDITIONAL_LICENSING_FEE_TYPES.CONDITIONAL_LICENSING_FEE_RATE
                    ? "conditional-licensing-fee-type--active"
                    : ""
                }`}
              >
                <FormControlLabel
                  className="conditional-licensing-fee-type__label"
                  label={
                    <div className="conditional-licensing-fee-type__description">
                      <span className="clf-description">
                        Conditional license fee rate in accordance with
                      </span>

                      <CustomExternalLink
                        href={CONDITIONAL_LICENSING_FEE_LINKS.CONDITIONAL_LICENSING_FEE_RATE.URL}
                        className="conditional-licensing-fee-type__link"
                        data-testid="conditional-licensing-fee-link"
                        withLinkIcon={true}
                      >
                        {CONDITIONAL_LICENSING_FEE_LINKS.CONDITIONAL_LICENSING_FEE_RATE.LINK_TEXT}
                      </CustomExternalLink>
                    </div>
                  }
                  value={CONDITIONAL_LICENSING_FEE_TYPES.CONDITIONAL_LICENSING_FEE_RATE}
                  control={
                    <Radio
                      key="conditional"
                      className="conditional-licensing-fee-type__radio"
                      classes={{
                        checked: "conditional-licensing-fee-type__radio--checked",
                        disabled: "conditional-licensing-fee-type__radio--disabled",
                      }}
                      disabled={!availableCLFs.includes(CONDITIONAL_LICENSING_FEE_TYPES.CONDITIONAL_LICENSING_FEE_RATE)}
                    />
                  }
                />
              </div>

              <div
                className={`conditional-licensing-fee-type conditional-licensing-fee-type--industrial ${
                  conditionalLicensingFeeType === CONDITIONAL_LICENSING_FEE_TYPES.INDUSTRIAL_X_PLATE_TYPE_FEE_RATE
                    ? "conditional-licensing-fee-type--active"
                    : ""
                }`}
              >
                <FormControlLabel
                  className="conditional-licensing-fee-type__label"
                  label={
                    <div className="conditional-licensing-fee-type__description">
                      <span className="clf-description">
                        Industrial (X-Plate Type) fee rate in accordance with
                      </span>

                      <CustomExternalLink
                        href={CONDITIONAL_LICENSING_FEE_LINKS.INDUSTRIAL_X_PLATE_TYPE_FEE_RATE.URL}
                        className="conditional-licensing-fee-type__link"
                        data-testid="conditional-licensing-fee-link"
                        withLinkIcon={true}
                      >
                        {CONDITIONAL_LICENSING_FEE_LINKS.INDUSTRIAL_X_PLATE_TYPE_FEE_RATE.LINK_TEXT}
                      </CustomExternalLink>
                    </div>
                  }
                  value={CONDITIONAL_LICENSING_FEE_TYPES.INDUSTRIAL_X_PLATE_TYPE_FEE_RATE}
                  control={
                    <Radio
                      key="conditional"
                      className="conditional-licensing-fee-type__radio"
                      classes={{
                        checked: "conditional-licensing-fee-type__radio--checked",
                        disabled: "conditional-licensing-fee-type__radio--disabled",
                      }}
                      disabled={!availableCLFs.includes(CONDITIONAL_LICENSING_FEE_TYPES.INDUSTRIAL_X_PLATE_TYPE_FEE_RATE)}
                    />
                  }
                />
              </div>

              <div
                className={`conditional-licensing-fee-type conditional-licensing-fee-type--farm-vehicle ${
                  conditionalLicensingFeeType === CONDITIONAL_LICENSING_FEE_TYPES.FARM_VEHICLE_FEE_RATE
                    ? "conditional-licensing-fee-type--active"
                    : ""
                }`}
              >
                <FormControlLabel
                  className="conditional-licensing-fee-type__label"
                  label={
                    <div className="conditional-licensing-fee-type__description">
                      <span className="clf-description">
                        Farm Vehicle fee rate in accordance with
                      </span>

                      <CustomExternalLink
                        href={CONDITIONAL_LICENSING_FEE_LINKS.FARM_VEHICLE_FEE_RATE.URL}
                        className="conditional-licensing-fee-type__link"
                        data-testid="conditional-licensing-fee-link"
                        withLinkIcon={true}
                      >
                        {CONDITIONAL_LICENSING_FEE_LINKS.FARM_VEHICLE_FEE_RATE.LINK_TEXT}
                      </CustomExternalLink>
                    </div>
                  }
                  value={CONDITIONAL_LICENSING_FEE_TYPES.FARM_VEHICLE_FEE_RATE}
                  control={
                    <Radio
                      key="conditional"
                      className="conditional-licensing-fee-type__radio"
                      classes={{
                        checked: "conditional-licensing-fee-type__radio--checked",
                        disabled: "conditional-licensing-fee-type__radio--disabled",
                      }}
                      disabled={!availableCLFs.includes(CONDITIONAL_LICENSING_FEE_TYPES.FARM_VEHICLE_FEE_RATE)}
                    />
                  }
                />
              </div>

              <div
                className={`conditional-licensing-fee-type conditional-licensing-fee-type--farm-tractor ${
                  conditionalLicensingFeeType === CONDITIONAL_LICENSING_FEE_TYPES.FARM_TRACTOR_FEE_RATE
                    ? "conditional-licensing-fee-type--active"
                    : ""
                }`}
              >
                <FormControlLabel
                  className="conditional-licensing-fee-type__label"
                  label={
                    <div className="conditional-licensing-fee-type__description">
                      <span className="clf-description">
                        Farm Tractor fee rate in accordance with
                      </span>
                      
                      <CustomExternalLink
                        href={CONDITIONAL_LICENSING_FEE_LINKS.FARM_TRACTOR_FEE_RATE.URL}
                        className="conditional-licensing-fee-type__link"
                        data-testid="conditional-licensing-fee-link"
                        withLinkIcon={true}
                      >
                        {CONDITIONAL_LICENSING_FEE_LINKS.FARM_TRACTOR_FEE_RATE.LINK_TEXT}
                      </CustomExternalLink>
                    </div>
                  }
                  value={CONDITIONAL_LICENSING_FEE_TYPES.FARM_TRACTOR_FEE_RATE}
                  control={
                    <Radio
                      key="conditional"
                      className="conditional-licensing-fee-type__radio"
                      classes={{
                        checked: "conditional-licensing-fee-type__radio--checked",
                        disabled: "conditional-licensing-fee-type__radio--disabled",
                      }}
                      disabled={!availableCLFs.includes(CONDITIONAL_LICENSING_FEE_TYPES.FARM_TRACTOR_FEE_RATE)}
                    />
                  }
                />
              </div>
            </RadioGroup>
          )}
        />
      </Box>
    </div>
  ) : null;
};
