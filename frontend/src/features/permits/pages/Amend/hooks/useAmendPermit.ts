import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Nullable } from "../../../../../common/types/common";
import {
  AmendPermitFormData,
  getDefaultFromNullableFormData,
} from "../types/AmendPermitFormData";

export const useAmendPermit = (
  repopulateFormData: boolean,
  updatedPermitFormData?: Nullable<AmendPermitFormData>,
) => {
  const formData = getDefaultFromNullableFormData(updatedPermitFormData);

  // Register default values with react-hook-form
  const formMethods = useForm<AmendPermitFormData>({
    defaultValues: formData,
    reValidateMode: "onBlur",
  });

  const { reset } = formMethods;

  useEffect(() => {
    reset(getDefaultFromNullableFormData(updatedPermitFormData));
  }, [updatedPermitFormData, repopulateFormData]);

  return {
    formData,
    formMethods,
  };
};
