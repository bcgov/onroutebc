/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import "./BridgeFormulaCalculationTool.scss";
import { NumberInput } from "../../../common/components/form/subFormComponents/NumberInput";
import { RequiredOrNull } from "../../../common/types/common";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { convertToNumberIfValid } from "../../../common/helpers/numeric/convertToNumberIfValid";
import { requiredMessage } from "../../../common/helpers/validationMessages";
import { useEffect } from "react";
import { AxleUnit } from "../types/AxleUnit";
import { BFCTTable } from "./BFCTTable";

export const BFCT = () => {
  const defaultAxleUnits = [
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
  ];

  const formMethods = useForm<{
    axleUnits: AxleUnit[];
  }>({
    defaultValues: {
      axleUnits: defaultAxleUnits,
    },
  });

  const fieldArrayMethods = useFieldArray({
    control: formMethods.control,
    name: "axleUnits",
  });

  const addAxleUnit = () => {
    fieldArrayMethods.append({
      interaxleSpacing: null,
    });
    fieldArrayMethods.append({
      numberOfAxles: null,
      axleSpread: null,
      axleUnitWeight: null,
    });
  };

  const combineInteraxleSpacing = (axleUnits: AxleUnit[]) => {
    for (let i = 1; i < axleUnits.length - 1; i++) {
      axleUnits[i + 1].interaxleSpacing = axleUnits[i].interaxleSpacing;
      axleUnits.splice(i, 1);
    }
    return axleUnits;
  };

  const onSubmit = (data: { axleUnits: AxleUnit[] }) => {
    console.log(combineInteraxleSpacing(data.axleUnits));
  };

  return (
    <div className="bridge-formula-calculation-tool">
      <FormProvider {...formMethods}>
        <BFCTTable />
      </FormProvider>
    </div>
  );
};
