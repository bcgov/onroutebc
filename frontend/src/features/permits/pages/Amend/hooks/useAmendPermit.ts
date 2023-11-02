import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { 
  AmendPermitFormData, 
  getDefaultFromNullableFormData, 
} from "../types/AmendPermitFormData";

export const useAmendPermit = (
  repopulateFormData: boolean,
  updatedPermitFormData?: AmendPermitFormData | null
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
