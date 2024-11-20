import { Box } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import "./LoadedDimensionsSection.scss";
import { mustBeGreaterThanOrEqualTo, requiredMessage } from "../../../../../../../common/helpers/validationMessages";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { NumberInput } from "../../../../../../../common/components/form/subFormComponents/NumberInput";
import { ApplicationFormData } from "../../../../../types/application";
import { convertToNumberIfValid } from "../../../../../../../common/helpers/numeric/convertToNumberIfValid";
import { Nullable } from "../../../../../../../common/types/common";
import { PermitVehicleConfiguration } from "../../../../../types/PermitVehicleConfiguration";
import { getDefaultRequiredVal } from "../../../../../../../common/helpers/util";

export const LoadedDimensionsSection = ({
  permitType,
  feature,
  vehicleConfiguration,
}: {
  permitType: PermitType;
  feature: string;
  vehicleConfiguration?: Nullable<PermitVehicleConfiguration>;
}) => {
  const { setValue } = useFormContext<ApplicationFormData>();

  return permitType === PERMIT_TYPES.STOS ? (
    <Box className="loaded-dimensions-section">
      <Box className="loaded-dimensions-section__header">
        <h3 className="loaded-dimensions-section__title">
          Loaded Dimensions (Metres)
        </h3>
      </Box>

      <Box className="loaded-dimensions-section__body">
        <div className="loaded-dimensions-section__input-row loaded-dimensions-section__input-row--first">
          <Controller
            name="permitData.vehicleConfiguration.overallWidth"
            rules={{
              required: { value: true, message: requiredMessage() },
              min: { value: 0.01, message: mustBeGreaterThanOrEqualTo(0.01) },
            }}
            render={({ fieldState: {error} }) => (
              <NumberInput
                label={{
                  id: `${feature}-overall-width-label`,
                  component: "Overall Width",
                }}
                classes={{
                  root: "loaded-dimensions-section__input loaded-dimensions-section__input--first",
                }}
                inputProps={{
                  value: getDefaultRequiredVal(null, vehicleConfiguration?.overallWidth),
                  maskFn: (numericVal) => numericVal.toFixed(2),
                  onBlur: (e) => {
                    setValue(
                      "permitData.vehicleConfiguration.overallWidth",
                      convertToNumberIfValid(e.target.value, null),
                    );
                  },
                  slotProps: {
                    input: {
                      min: 0,
                      step: 0.01,
                    },
                  },
                }}
                helperText={error?.message ? {
                  errors: [error.message],
                } : undefined}
              />
            )}
          />

          <Controller
            name="permitData.vehicleConfiguration.overallHeight"
            rules={{
              required: { value: true, message: requiredMessage() },
              min: { value: 0.01, message: mustBeGreaterThanOrEqualTo(0.01) },
            }}
            render={({ fieldState: {error} }) => (
              <NumberInput
                label={{
                  id: `${feature}-overall-height-label`,
                  component: "Overall Height",
                }}
                classes={{
                  root: "loaded-dimensions-section__input",
                }}
                inputProps={{
                  value: getDefaultRequiredVal(null, vehicleConfiguration?.overallHeight),
                  maskFn: (numericVal) => numericVal.toFixed(2),
                  onBlur: (e) => {
                    setValue(
                      "permitData.vehicleConfiguration.overallHeight",
                      convertToNumberIfValid(e.target.value, null),
                    );
                  },
                  slotProps: {
                    input: {
                      min: 0,
                      step: 0.01,
                    },
                  },
                }}
                helperText={error?.message ? {
                  errors: [error.message],
                } : undefined}
              />
            )}
          />

          <Controller
            name="permitData.vehicleConfiguration.overallLength"
            rules={{
              required: { value: true, message: requiredMessage() },
              min: { value: 0.01, message: mustBeGreaterThanOrEqualTo(0.01) },
            }}
            render={({ fieldState: {error} }) => (
              <NumberInput
                label={{
                  id: `${feature}-overall-length-label`,
                  component: "Overall Length",
                }}
                classes={{
                  root: "loaded-dimensions-section__input",
                }}
                inputProps={{
                  value: getDefaultRequiredVal(null, vehicleConfiguration?.overallLength),
                  maskFn: (numericVal) => numericVal.toFixed(2),
                  onBlur: (e) => {
                    setValue(
                      "permitData.vehicleConfiguration.overallLength",
                      convertToNumberIfValid(e.target.value, null),
                    );
                  },
                  slotProps: {
                    input: {
                      min: 0,
                      step: 0.01,
                    },
                  },
                }}
                helperText={error?.message ? {
                  errors: [error.message],
                } : undefined}
              />
            )}
          />
        </div>

        <div className="loaded-dimensions-section__input-row">
          <Controller
            name="permitData.vehicleConfiguration.frontProjection"
            rules={{
              required: { value: true, message: requiredMessage() },
              min: { value: 0.01, message: mustBeGreaterThanOrEqualTo(0.01) },
            }}
            render={({ fieldState: {error} }) => (
              <NumberInput
                label={{
                  id: `${feature}-front-projection-label`,
                  component: "Front Projection",
                }}
                classes={{
                  root: "loaded-dimensions-section__input loaded-dimensions-section__input--first",
                }}
                inputProps={{
                  value: getDefaultRequiredVal(null, vehicleConfiguration?.frontProjection),
                  maskFn: (numericVal) => numericVal.toFixed(2),
                  onBlur: (e) => {
                    setValue(
                      "permitData.vehicleConfiguration.frontProjection",
                      convertToNumberIfValid(e.target.value, null),
                    );
                  },
                  slotProps: {
                    input: {
                      min: 0,
                      step: 0.01,
                    },
                  },
                }}
                helperText={error?.message ? {
                  errors: [error.message],
                } : undefined}
              />
            )}
          />

          <Controller
            name="permitData.vehicleConfiguration.rearProjection"
            rules={{
              required: { value: true, message: requiredMessage() },
              min: { value: 0.01, message: mustBeGreaterThanOrEqualTo(0.01) },
            }}
            render={({ fieldState: {error} }) => (
              <NumberInput
                label={{
                  id: `${feature}-rear-projection-label`,
                  component: "Rear Projection",
                }}
                classes={{
                  root: "loaded-dimensions-section__input",
                }}
                inputProps={{
                  value: getDefaultRequiredVal(null, vehicleConfiguration?.rearProjection),
                  maskFn: (numericVal) => numericVal.toFixed(2),
                  onBlur: (e) => {
                    setValue(
                      "permitData.vehicleConfiguration.rearProjection",
                      convertToNumberIfValid(e.target.value, null),
                    );
                  },
                  slotProps: {
                    input: {
                      min: 0,
                      step: 0.01,
                    },
                  },
                }}
                helperText={error?.message ? {
                  errors: [error.message],
                } : undefined}
              />
            )}
          />
        </div>
      </Box>
    </Box>
  ) : null;
};
