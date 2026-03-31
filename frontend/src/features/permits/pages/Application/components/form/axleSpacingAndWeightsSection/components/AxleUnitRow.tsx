/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Control,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Nullable } from "../../../../../../../../common/types/common";
import { Autocomplete } from "../../../../../../../../common/components/form/subFormComponents/Autocomplete";
import { NumberInput } from "../../../../../../../../common/components/form/subFormComponents/NumberInput";
import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import { convertToNumberIfValid } from "../../../../../../../../common/helpers/numeric/convertToNumberIfValid";
import { ApplicationFormData } from "../../../../../../types/application";
import { usePolicyEngine } from "../../../../../../../policy/hooks/usePolicyEngine";

type AxleUnitsArrayPath =
  | "permitData.vehicleConfiguration.axleConfiguration"
  | `permitData.vehicleConfiguration.trailers.${number}.axleConfiguration`;

export const AxleUnitRow = ({
  control,
  path,
  label,
  axleUnitNumber,
  isTrailer = false,
}: {
  control: Control<ApplicationFormData>;
  path: AxleUnitsArrayPath;
  label: Nullable<string>;
  axleUnitNumber: number;
  isTrailer?: boolean;
}) => {
  const { setValue } = useFormContext<ApplicationFormData>();

  const { fields } = useFieldArray({
    control,
    name: path,
  });
  const axleUnits = useWatch({
    control,
    name: path,
  });

  const policyEngine = usePolicyEngine();

  const tireSizeOptions = policyEngine?.getStandardTireSizes() ?? [];

  const defaultTireSizeOption = tireSizeOptions[1];

  return (
    <>
      <tr className="table__row table__row--subtype">
        <td colSpan={7} className="row__label row__label--subtype">
          {label}
        </td>
      </tr>

      {fields.map((field, index) => {
        // Each interaxle spacing row follows a regular (complete) axle unit row, because trailer axle units are displayed with the interaxle spacing row first, we must calculate the interaxle spacing row index differently for trailers and power units.
        const isInteraxleSpacingRow = isTrailer
          ? index % 2 === 0
          : index % 2 === 1;

        const axleUnitNumberDisplay = !isInteraxleSpacingRow
          ? axleUnitNumber + Math.floor(index / 2) + 1
          : 0;

        const numberOfAxles = axleUnits?.[index]?.numberOfAxles;
        const disableAxleSpread = numberOfAxles === 1;

        return (
          <tr key={field.id} className="table__row">
            <td className="row__label">
              {!isInteraxleSpacingRow && axleUnitNumberDisplay}
            </td>
            <td className="table__cell">
              {!isInteraxleSpacingRow && (
                <Controller
                  name={`${path}.${index}.numberOfAxles` as const}
                  control={control}
                  render={({ field, fieldState: { invalid } }) => (
                    <NumberInput
                      classes={{ root: "table__input-container" }}
                      inputProps={{
                        className: "table__input",
                        value: getDefaultRequiredVal(
                          null,
                          field.value as Nullable<number>,
                        ),
                        onBlur: ({ target: { value } }) => {
                          const updatedNumberOfAxles = convertToNumberIfValid(
                            value,
                            null,
                          );

                          field.onChange(updatedNumberOfAxles);

                          if (updatedNumberOfAxles === 1) {
                            setValue(
                              `${path}.${index}.axleSpread` as const,
                              null,
                            );
                          }

                          field.onBlur();
                        },
                        maskFn: (numericVal) => numericVal.toFixed(0),
                        error: invalid,
                      }}
                    />
                  )}
                />
              )}
            </td>
            <td className="table__cell">
              {!isInteraxleSpacingRow && (
                <Controller
                  name={`${path}.${index}.numberOfTires` as const}
                  control={control}
                  render={({ field, fieldState: { invalid } }) => (
                    <NumberInput
                      classes={{ root: "table__input-container" }}
                      inputProps={{
                        className: "table__input",
                        value: getDefaultRequiredVal(
                          null,
                          field.value as Nullable<number>,
                        ),
                        onBlur: ({ target: { value } }) => {
                          field.onChange(convertToNumberIfValid(value, null));
                          field.onBlur();
                        },
                        maskFn: (numericVal) => numericVal.toFixed(0),
                        error: invalid,
                      }}
                    />
                  )}
                />
              )}
            </td>
            <td className="table__cell">
              {!isInteraxleSpacingRow && (
                <Controller
                  name={`${path}.${index}.tireSize` as const}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      classes={{ root: "table__input-container" }}
                      autocompleteProps={{
                        className: "table__input table__input--select",
                        clearIcon: null,
                        options: tireSizeOptions,
                        value:
                          tireSizeOptions.find(
                            (option) => option.size === field.value,
                          ) ?? defaultTireSizeOption,
                        getOptionLabel: (option) => option.name,
                        isOptionEqualToValue: (option, value) =>
                          option.size === value.size,
                        onChange: (_, selectedOption) => {
                          field.onChange(
                            selectedOption ? selectedOption.size : null,
                          );
                        },
                        onBlur: field.onBlur,
                      }}
                    />
                  )}
                />
              )}
            </td>
            <td className="table__cell">
              {isInteraxleSpacingRow && (
                <Controller
                  name={`${path}.${index}.interaxleSpacing` as const}
                  control={control}
                  render={({ field, fieldState: { invalid } }) => (
                    <NumberInput
                      classes={{ root: "table__input-container" }}
                      inputProps={{
                        className: "table__input",
                        value: getDefaultRequiredVal(
                          null,
                          field.value as Nullable<number>,
                        ),
                        onBlur: ({ target: { value } }) => {
                          field.onChange(convertToNumberIfValid(value, null));
                          field.onBlur();
                        },
                        error: invalid,
                      }}
                    />
                  )}
                />
              )}
            </td>
            <td className="table__cell">
              {!isInteraxleSpacingRow && (
                <Controller
                  name={`${path}.${index}.axleSpread` as const}
                  control={control}
                  render={({ field, fieldState: { invalid } }) => (
                    <NumberInput
                      classes={{ root: "table__input-container" }}
                      inputProps={{
                        className: "table__input",
                        value: getDefaultRequiredVal(
                          null,
                          field.value as Nullable<number>,
                        ),
                        onBlur: ({ target: { value } }) => {
                          field.onChange(convertToNumberIfValid(value, null));
                          field.onBlur();
                        },
                        error: invalid,
                        readOnly: disableAxleSpread,
                        disabled: disableAxleSpread,
                      }}
                    />
                  )}
                />
              )}
            </td>
            <td className="table__cell">
              {!isInteraxleSpacingRow && (
                <Controller
                  name={`${path}.${index}.axleUnitWeight` as const}
                  control={control}
                  render={({ field, fieldState: { invalid } }) => (
                    <NumberInput
                      classes={{ root: "table__input-container" }}
                      inputProps={{
                        className: "table__input",
                        value: getDefaultRequiredVal(
                          null,
                          field.value as Nullable<number>,
                        ),
                        onBlur: ({ target: { value } }) => {
                          field.onChange(convertToNumberIfValid(value, null));
                          field.onBlur();
                        },
                        error: invalid,
                      }}
                    />
                  )}
                />
              )}
            </td>
          </tr>
        );
      })}
    </>
  );
};
