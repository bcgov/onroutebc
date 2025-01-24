import { useState } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import "./BridgeFormulaCalculationTool.scss";
import { NumberInput } from "../../../common/components/form/subFormComponents/NumberInput";
import { RequiredOrNull } from "../../../common/types/common";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { convertToNumberIfValid } from "../../../common/helpers/numeric/convertToNumberIfValid";
import { RemoveAxleUnitModal } from "./RemoveAxleUnitModal";

interface AxleUnit {
  numberOfAxles?: RequiredOrNull<number>;
  axleSpread?: RequiredOrNull<number>;
  interaxleSpacing?: RequiredOrNull<number>;
  axleUnitWeight?: RequiredOrNull<number>;
  numberOfTires?: RequiredOrNull<number>;
  tireSize?: RequiredOrNull<number>;
}

export const BridgeFormulaCalculationTool = () => {
  const { control, handleSubmit, watch, setValue, reset } = useForm<{
    axleUnits: AxleUnit[];
  }>({
    defaultValues: {
      axleUnits: [
        {
          numberOfAxles: null,
          axleSpread: null,
          axleUnitWeight: null,
        },
        {
          interaxleSpacing: null,
        },
        {
          numberOfAxles: null,
          axleSpread: null,
          axleUnitWeight: null,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "axleUnits",
  });

  const axleUnits = watch("axleUnits");

  const handleAddAxleUnit = () => {
    append({
      interaxleSpacing: null,
    });
    append({
      numberOfAxles: null,
      axleSpread: null,
      axleUnitWeight: null,
    });
  };

  const handleCloseRemoveAxleUnitModal = () => {
    setAxleUnitsToRemove([]);
    setIsRemoveAxleUnitModalOpen(false);
  };

  const [axleUnitsToRemove, setAxleUnitsToRemove] = useState<number[]>();

  const handleRemoveAxleUnitButton = (index: number) => {
    setAxleUnitsToRemove([index, index - 1]);
    setIsRemoveAxleUnitModalOpen(true);
  };

  const handleRemoveAxleUnits = () => {
    remove(axleUnitsToRemove);
    setIsRemoveAxleUnitModalOpen(false);
  };

  const combineInteraxleSpacing = (axleUnits: AxleUnit[]) => {
    for (let i = 1; i < axleUnits.length - 1; i++) {
      axleUnits[i + 1].interaxleSpacing = axleUnits[i].interaxleSpacing;
      axleUnits.splice(i, 1);
    }
    return axleUnits;
  };

  const handleReset = () => {
    reset();
  };

  const onSubmit = (data: { axleUnits: AxleUnit[] }) => {
    console.log(combineInteraxleSpacing(data.axleUnits));
  };

  const [isRemoveAxleUnitModalOpen, setIsRemoveAxleUnitModalOpen] =
    useState<boolean>(false);

  return (
    <div className="bridge-formula-calculation-tool">
      <div className="table-container">
        <table className="table">
          <thead className="table__head">
            <tr>
              <th className="column__label">Axle Unit</th>
              {fields.map((field, index) => {
                // Ensure the column number is shown for every axle unit (even and odd index)
                if (index % 2 === 0) {
                  const axleUnitNumber = Math.floor(index / 2) + 1;
                  return (
                    <th key={field.id} className="column__label">
                      <div className="column-label__inner">
                        {axleUnitNumber}
                        {axleUnitNumber >= 3 && (
                          <Tooltip title="Remove">
                            <IconButton
                              onClick={() => handleRemoveAxleUnitButton(index)}
                              className="button--remove"
                              aria-label={`Remove axle unit ${axleUnitNumber}`}
                            >
                              <FontAwesomeIcon
                                icon={faMinus}
                                className="button-icon"
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    </th>
                  );
                } else {
                  return (
                    <th key={field.id} className="column__label">
                      {/* Blank column for odd indices */}
                    </th>
                  );
                }
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="row__label">Number of Axles</td>
              {fields.map((field, index) => {
                const fieldName = `axleUnits.${index}.numberOfAxles` as const;
                const axleSpreadFieldName =
                  `axleUnits.${index}.axleSpread` as const;
                const numberOfAxles = axleUnits[index].numberOfAxles;
                return (
                  <td key={field.id} className="table__cell">
                    {index % 2 === 0 && (
                      <Controller
                        name={fieldName}
                        control={control}
                        rules={{
                          required: true,
                          min: 1,
                        }}
                        render={({ fieldState: { invalid } }) => (
                          <NumberInput
                            classes={{ root: "table__input-container" }}
                            inputProps={{
                              className: "table__input",
                              value: getDefaultRequiredVal(null, numberOfAxles),
                              onBlur: ({ target: { value } }) => {
                                const updatedNumberOfAxles =
                                  getDefaultRequiredVal(
                                    null,
                                    convertToNumberIfValid(value, null),
                                  );

                                setValue(fieldName, updatedNumberOfAxles);

                                if (updatedNumberOfAxles === 1) {
                                  setValue(axleSpreadFieldName, null);
                                }
                              },
                              maskFn: (numericVal) => numericVal.toFixed(0),
                              error: invalid,
                            }}
                          />
                        )}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="row__label">Axle Spread (m)</td>
              {fields.map((field, index) => {
                const fieldName = `axleUnits.${index}.axleSpread` as const;
                const axleSpread = axleUnits[index].axleSpread;
                const numberOfAxles = axleUnits[index].numberOfAxles;
                const disabled = numberOfAxles === 1;
                return (
                  <td key={field.id} className="table__cell">
                    {index % 2 === 0 && (
                      // <input
                      //   type="text"
                      //   {...register(fieldName)}
                      //   disabled={disabled}
                      // />
                      <Controller
                        name={fieldName}
                        control={control}
                        rules={{
                          required: !disabled && true,
                          min: 0.01,
                        }}
                        render={({ fieldState: { invalid } }) => (
                          <NumberInput
                            inputProps={{
                              value: getDefaultRequiredVal(null, axleSpread),
                              onBlur: ({ target: { value } }) =>
                                setValue(
                                  fieldName,
                                  getDefaultRequiredVal(
                                    null,
                                    convertToNumberIfValid(value, null),
                                  ),
                                ),
                              maskFn: (numericVal) => numericVal.toFixed(2),
                              error: invalid,
                              readOnly: disabled,
                              disabled,
                            }}
                          />
                        )}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="row__label">Interaxle Spacing (m)</td>
              {fields.map((field, index) => {
                const fieldName =
                  `axleUnits.${index}.interaxleSpacing` as const;
                const interaxleSpacing = axleUnits[index].interaxleSpacing;
                return (
                  <td key={field.id} className="table__cell">
                    {index % 2 !== 0 && (
                      <Controller
                        name={fieldName}
                        control={control}
                        rules={{
                          required: true,
                          min: 0.01,
                        }}
                        render={({ fieldState: { invalid } }) => (
                          <NumberInput
                            inputProps={{
                              value: getDefaultRequiredVal(
                                null,
                                interaxleSpacing,
                              ),
                              onBlur: ({ target: { value } }) =>
                                setValue(
                                  fieldName,
                                  getDefaultRequiredVal(
                                    null,
                                    convertToNumberIfValid(value, null),
                                  ),
                                ),
                              maskFn: (numericVal) => numericVal.toFixed(2),
                              error: invalid,
                            }}
                          />
                        )}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="row__label">Axle Unit Weight (kg)</td>
              {fields.map((field, index) => {
                const fieldName = `axleUnits.${index}.axleUnitWeight` as const;
                const axleUnitWeight = axleUnits[index].axleUnitWeight;
                return (
                  <td key={field.id} className="table__cell">
                    {index % 2 === 0 && (
                      <Controller
                        name={fieldName}
                        control={control}
                        rules={{
                          required: true,
                          min: 0.01,
                        }}
                        render={({ fieldState: { invalid } }) => (
                          <NumberInput
                            inputProps={{
                              value: getDefaultRequiredVal(
                                null,
                                axleUnitWeight,
                              ),
                              onBlur: ({ target: { value } }) =>
                                setValue(
                                  fieldName,
                                  getDefaultRequiredVal(
                                    null,
                                    convertToNumberIfValid(value, null),
                                  ),
                                ),
                              maskFn: (numericVal) => numericVal.toFixed(0),
                              error: invalid,
                            }}
                          />
                        )}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
        <Button
          variant="outlined"
          onClick={handleAddAxleUnit}
          className="button button--add"
        >
          + Add Axle Unit
        </Button>
      </div>
      <div className="button-container">
        <Button
          variant="contained"
          onClick={handleReset}
          className="button button--reset"
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          className="button button--submit"
        >
          Calculate
        </Button>
      </div>

      <RemoveAxleUnitModal
        isOpen={isRemoveAxleUnitModalOpen}
        onCancel={handleCloseRemoveAxleUnitModal}
        onConfirm={handleRemoveAxleUnits}
      />
    </div>
  );
};
