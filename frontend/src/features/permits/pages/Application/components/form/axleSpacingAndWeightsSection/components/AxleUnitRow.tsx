import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nullable } from "../../../../../../../../common/types/common";
import { Autocomplete } from "../../../../../../../../common/components/form/subFormComponents/Autocomplete";
import { NumberInput } from "../../../../../../../../common/components/form/subFormComponents/NumberInput";
import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import { convertToNumberIfValid } from "../../../../../../../../common/helpers/numeric/convertToNumberIfValid";
import { IconButton, Tooltip } from "@mui/material";
import {
  POLICY_CHECK_ID_TYPES,
  PolicyCheckIdType,
} from "../../../../../../types/AxleCalculationResult";
import { AxleUnit } from "../../../../../../types/AxleUnit";
import {
  DEFAULT_AXLE_UNIT,
  DEFAULT_TIRE_SIZE_OPTION,
} from "../../../../../../constants/constants";

export const AxleUnitRow = ({
  axleConfiguration,
  label,
  axleUnitNumber,
  isTrailer,
  onUpdateAxleConfiguration,
  tireSizeOptions = [],
  axleCalculationFailures = [],
  canAddAxleUnits,
}: {
  axleConfiguration: AxleUnit[];
  label: Nullable<string>;
  axleUnitNumber: number;
  isTrailer: boolean;
  onUpdateAxleConfiguration: (axleConfiguration: AxleUnit[]) => void;
  tireSizeOptions?: {
    name: string;
    size: number;
  }[];
  axleCalculationFailures?: Array<Partial<Record<PolicyCheckIdType, boolean>>>;
  canAddAxleUnits?: boolean;
}) => {
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

  const addAxleUnit = () => {
    const newAxleConfiguration = [
      ...axleConfiguration,
      { interaxleSpacing: null },
      DEFAULT_AXLE_UNIT,
    ];
    onUpdateAxleConfiguration(newAxleConfiguration);
  };

  const removeAxleUnit = () => {
    if (axleConfiguration.length >= 4) {
      // Remove the last two items (interaxle spacing + axle unit pair)
      const newAxleConfiguration = axleConfiguration.slice(0, -2);
      onUpdateAxleConfiguration(newAxleConfiguration);
    }
  };

  const defaultAxleUnitCount = isTrailer ? 1 : 2;

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
        const axleUnitCount = Math.ceil(axleConfiguration.length / 2);
        const isLastAxleUnitRow =
          !isInteraxleSpacingRow && index === axleConfiguration.length - 1;
        const canRemoveLastAxleUnit = axleUnitCount > defaultAxleUnitCount;

        const numberOfAxles = axleUnit?.numberOfAxles;
        const disableAxleSpread = getDefaultRequiredVal(0, numberOfAxles) <= 1;

        const axleCalculationFailure = getDefaultRequiredVal(
          {},
          axleCalculationFailures[index],
        );
        const hasAxleUnitWeightFailure = Boolean(
          axleCalculationFailure[
            POLICY_CHECK_ID_TYPES.DRIVE_JEEP_LOAD_EQUALIZATION
          ] ||
            axleCalculationFailure[
              POLICY_CHECK_ID_TYPES.MINIMUM_STEER_AXLE_WEIGHT
            ] ||
            axleCalculationFailure[
              POLICY_CHECK_ID_TYPES.MINIMUM_TANDEM_STEER_AXLE_WEIGHT
            ],
        );

        return (
          <tr key={`axle-${label}-${index}`} className="table__row">
            <td
              className={`${
                axleCalculationFailure[POLICY_CHECK_ID_TYPES.BRIDGE_FORMULA]
                  ? "row__label row__label--fail"
                  : "row__label"
              }`}
            >
              {!isInteraxleSpacingRow && (
                <div className="row__label-content">
                  <span>{axleUnitNumberDisplay}</span>

                  {isLastAxleUnitRow && canAddAxleUnits ? (
                    <div className="row__actions">
                      <Tooltip title="Add Axle Unit">
                        <IconButton
                          onClick={addAxleUnit}
                          className="row__button row__button--add"
                          aria-label="Add axle unit"
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="button__icon"
                          />
                        </IconButton>
                      </Tooltip>
                      {canRemoveLastAxleUnit ? (
                        <Tooltip title="Remove Axle Unit">
                          <IconButton
                            onClick={removeAxleUnit}
                            className="row__button row__button--remove"
                            aria-label={`Remove axle unit ${axleUnitNumber}`}
                          >
                            <FontAwesomeIcon
                              icon={faMinus}
                              className="button__icon"
                            />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )}
            </td>
            <td className="table__cell">
              {!isInteraxleSpacingRow && (
                <NumberInput
                  classes={{ root: "table__input-container" }}
                  inputProps={{
                    className: `table__input ${
                      axleCalculationFailure[
                        POLICY_CHECK_ID_TYPES.NUMBER_OF_AXLES
                      ]
                        ? "table__input--fail"
                        : ""
                    }`,
                    value: getDefaultRequiredVal(null, axleUnit?.numberOfAxles),
                    onBlur: ({ target: { value } }) => {
                      const updatedNumberOfAxles = convertToNumberIfValid(
                        value,
                        null,
                      );

                      const updatedConfiguration = axleConfiguration.map(
                        (currentAxleUnit, currentIndex) =>
                          currentIndex === index
                            ? {
                                ...currentAxleUnit,
                                numberOfAxles: updatedNumberOfAxles,
                                axleSpread:
                                  getDefaultRequiredVal(
                                    0,
                                    updatedNumberOfAxles,
                                  ) <= 1
                                    ? null
                                    : currentAxleUnit.axleSpread,
                              }
                            : currentAxleUnit,
                      );

                      onUpdateAxleConfiguration(updatedConfiguration);
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
                  classes={{
                    root: "table__input-container",
                  }}
                  autocompleteProps={{
                    className: "table__input table__input--tire-size",
                    clearIcon: null,
                    options: tireSizeOptions,
                    value: getDefaultRequiredVal(
                      DEFAULT_TIRE_SIZE_OPTION,
                      tireSizeOptions.find(
                        (option) => option.size === axleUnit?.tireSize,
                      ),
                    ),
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
                    maskFn: (numericVal) => numericVal.toFixed(2),
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
                    maskFn: (numericVal) => numericVal.toFixed(2),
                  }}
                />
              )}
            </td>
            <td className="table__cell">
              {!isInteraxleSpacingRow && (
                <NumberInput
                  classes={{ root: "table__input-container" }}
                  inputProps={{
                    className: `table__input ${
                      hasAxleUnitWeightFailure ? "table__input--fail" : ""
                    }`,
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
