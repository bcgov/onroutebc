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

type AxleUnitsArrayPath =
  | "permitData.vehicleConfiguration.axleUnits"
  | `permitData.vehicleConfiguration.trailers.${number}.axleUnits`;

type TireSizeOption = {
  value: number;
  label: string;
};

const TIRE_SIZE_OPTIONS: TireSizeOption[] = [
  { value: 254, label: '254 (10")' },
  { value: 279.4, label: '279.4 (11")' },
  { value: 304.8, label: '304.8 (12")' },
  { value: 315, label: '315 (12.4")' },
  { value: 325, label: '325 (12.8")' },
  { value: 330, label: '330 (13")' },
  { value: 355, label: '355 (14")' },
  { value: 365, label: '365 (14.4")' },
  { value: 368, label: '368 (14.5")' },
  { value: 381, label: '381 (15")' },
  { value: 385, label: '385 (15.2")' },
  { value: 393, label: '393 (15.5")' },
  { value: 406, label: '406 (16")' },
  { value: 425, label: '425 (16.7")' },
  { value: 431, label: '431 (17")' },
  { value: 445, label: '445 (17.5")' },
  { value: 457, label: '457 (18")' },
  { value: 502, label: '502 (19.8")' },
  { value: 508, label: '508 (20")' },
  { value: 520, label: '520 (20.5")' },
  { value: 525, label: '525 (20.7")' },
  { value: 550, label: '550 (21.7")' },
  { value: 609, label: '609 (24")' },
  { value: 622, label: '622 (24.5")' },
  { value: 636, label: '636 (25")' },
  { value: 711.2, label: '711.2 (28")' },
];

const DEFAULT_TIRE_SIZE_OPTION = TIRE_SIZE_OPTIONS[1];

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
                // TODO all fields are being reset when clicking "Save Application" button
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
                        options: TIRE_SIZE_OPTIONS,
                        value:
                          TIRE_SIZE_OPTIONS.find(
                            (option) => option.value === field.value,
                          ) ?? DEFAULT_TIRE_SIZE_OPTION,
                        getOptionLabel: (option) => option.label,
                        isOptionEqualToValue: (option, value) =>
                          option.value === value.value,
                        onChange: (_, selectedOption) => {
                          field.onChange(
                            selectedOption ? selectedOption.value : null,
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
