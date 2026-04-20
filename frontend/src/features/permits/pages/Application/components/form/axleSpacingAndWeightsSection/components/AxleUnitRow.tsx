import { Nullable } from "../../../../../../../../common/types/common";
import { Autocomplete } from "../../../../../../../../common/components/form/subFormComponents/Autocomplete";
import { NumberInput } from "../../../../../../../../common/components/form/subFormComponents/NumberInput";
import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import { convertToNumberIfValid } from "../../../../../../../../common/helpers/numeric/convertToNumberIfValid";
import { AxleUnit } from "../../../../../../../../common/types/AxleUnit";
import { usePolicyEngine } from "../../../../../../../policy/hooks/usePolicyEngine";

export const AxleUnitRow = ({
  axleConfiguration,
  label,
  axleUnitNumber,
  isTrailer,
  onUpdateAxleConfiguration,
}: {
  axleConfiguration: AxleUnit[];
  label: Nullable<string>;
  axleUnitNumber: number;
  isTrailer: boolean;
  onUpdateAxleConfiguration: (axleConfiguration: AxleUnit[]) => void;
}) => {
  const policyEngine = usePolicyEngine();

  const tireSizeOptions = policyEngine?.getStandardTireSizes() ?? [];

  const defaultTireSizeOption = tireSizeOptions[1];

  const updateAxleUnit = (
    axleIndex: number,
    field: keyof AxleUnit,
    value: number | string | null,
  ) => {
    const updatedConfiguration = axleConfiguration.map((axleUnit, index) =>
      index === axleIndex ? { ...axleUnit, [field]: value } : axleUnit,
    );
    onUpdateAxleConfiguration(updatedConfiguration);
  };

  return (
    <>
      <tr className="table__row table__row--subtype">
        <td colSpan={7} className="row__label row__label--subtype">
          {label}
        </td>
      </tr>

      {axleConfiguration.map((axleUnit, index) => {
        // Each interaxle spacing row follows a regular (complete) axle unit row, because trailer axle units are displayed with the interaxle spacing row first, we must calculate the interaxle spacing row index differently for trailers and power units.
        const isInteraxleSpacingRow = isTrailer
          ? index % 2 === 0
          : index % 2 === 1;

        const axleUnitNumberDisplay = !isInteraxleSpacingRow
          ? axleUnitNumber + Math.floor(index / 2) + 1
          : 0;

        const numberOfAxles = axleUnit?.numberOfAxles;
        const disableAxleSpread = numberOfAxles === 1;

        return (
          <tr key={`axle-${label}-${index}`} className="table__row">
            <td className="row__label">
              {!isInteraxleSpacingRow && axleUnitNumberDisplay}
            </td>
            <td className="table__cell">
              {!isInteraxleSpacingRow && (
                <NumberInput
                  classes={{ root: "table__input-container" }}
                  inputProps={{
                    className: "table__input",
                    value: getDefaultRequiredVal(null, axleUnit?.numberOfAxles),
                    onBlur: ({ target: { value } }) => {
                      const updatedNumberOfAxles = convertToNumberIfValid(
                        value,
                        null,
                      );

                      updateAxleUnit(
                        index,
                        "numberOfAxles",
                        updatedNumberOfAxles,
                      );

                      if (updatedNumberOfAxles === 1) {
                        updateAxleUnit(index, "axleSpread", null);
                      }
                    },
                    maskFn: (numericVal) => numericVal.toFixed(0),
                  }}
                />
              )}
            </td>
            <td className="table__cell">
              {!isInteraxleSpacingRow && (
                <NumberInput
                  classes={{ root: "table__input-container" }}
                  inputProps={{
                    className: "table__input",
                    value: getDefaultRequiredVal(null, axleUnit?.numberOfTires),
                    onBlur: ({ target: { value } }) => {
                      updateAxleUnit(
                        index,
                        "numberOfTires",
                        convertToNumberIfValid(value, null),
                      );
                    },
                    maskFn: (numericVal) => numericVal.toFixed(0),
                  }}
                />
              )}
            </td>
            <td className="table__cell">
              {!isInteraxleSpacingRow && (
                <Autocomplete
                  classes={{ root: "table__input-container" }}
                  autocompleteProps={{
                    className: "table__input table__input--select",
                    clearIcon: null,
                    options: tireSizeOptions,
                    value:
                      tireSizeOptions.find(
                        (option) => option.size === axleUnit?.tireSize,
                      ) ?? defaultTireSizeOption,
                    getOptionLabel: (option) => option.name,
                    isOptionEqualToValue: (option, value) =>
                      option.size === value.size,
                    onChange: (_, selectedOption) => {
                      updateAxleUnit(
                        index,
                        "tireSize",
                        selectedOption ? selectedOption.size : null,
                      );
                    },
                  }}
                />
              )}
            </td>
            <td className="table__cell">
              {isInteraxleSpacingRow && (
                <NumberInput
                  classes={{ root: "table__input-container" }}
                  inputProps={{
                    className: "table__input",
                    value: getDefaultRequiredVal(
                      null,
                      axleUnit?.interaxleSpacing,
                    ),
                    onBlur: ({ target: { value } }) => {
                      updateAxleUnit(
                        index,
                        "interaxleSpacing",
                        convertToNumberIfValid(value, null),
                      );
                    },
                  }}
                />
              )}
            </td>
            <td className="table__cell">
              {!isInteraxleSpacingRow && (
                <NumberInput
                  classes={{ root: "table__input-container" }}
                  inputProps={{
                    className: "table__input",
                    value: getDefaultRequiredVal(null, axleUnit?.axleSpread),
                    onBlur: ({ target: { value } }) => {
                      updateAxleUnit(
                        index,
                        "axleSpread",
                        convertToNumberIfValid(value, null),
                      );
                    },
                    readOnly: disableAxleSpread,
                    disabled: disableAxleSpread,
                  }}
                />
              )}
            </td>
            <td className="table__cell">
              {!isInteraxleSpacingRow && (
                <NumberInput
                  classes={{ root: "table__input-container" }}
                  inputProps={{
                    className: "table__input",
                    value: getDefaultRequiredVal(
                      null,
                      axleUnit?.axleUnitWeight,
                    ),
                    onBlur: ({ target: { value } }) => {
                      updateAxleUnit(
                        index,
                        "axleUnitWeight",
                        convertToNumberIfValid(value, null),
                      );
                    },
                  }}
                />
              )}
            </td>
          </tr>
        );
      })}
    </>
  );
};
