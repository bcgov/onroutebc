import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Nullable } from "../../../../../common/types/common";
import {
  AmendPermitFormData,
  getDefaultFromNullableFormData,
} from "../types/AmendPermitFormData";

export const useAmendPermitForm = (
  repopulateFormData: boolean,
  updatedPermitFormData?: Nullable<AmendPermitFormData>,
) => {
  const [formData, setFormData] = useState(
    getDefaultFromNullableFormData(updatedPermitFormData),
  );

  useEffect(() => {
    setFormData(getDefaultFromNullableFormData(updatedPermitFormData));
  }, [updatedPermitFormData, repopulateFormData]);

  // Register default values with react-hook-form
  const formMethods = useForm<AmendPermitFormData>({
    defaultValues: formData,
    reValidateMode: "onBlur",
  });

  const { reset } = formMethods;

  useEffect(() => {
    reset(formData);
  }, [formData]);

  return {
    formData,
    formMethods,
  };
};
