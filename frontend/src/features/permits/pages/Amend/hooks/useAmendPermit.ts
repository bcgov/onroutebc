import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { 
  AmendPermitFormData, 
  getDefaultForPermitForm, 
} from "../types/AmendPermitFormData";

export const useAmendPermit = (updatedPermitFormData?: AmendPermitFormData | null) => {
  const formData = getDefaultForPermitForm(updatedPermitFormData);

  // Register default values with react-hook-form
  const formMethods = useForm<AmendPermitFormData>({
    // defaultValues: getDefaultForPermitForm(permitRef.current),
    defaultValues: formData,
    reValidateMode: "onBlur",
  });

  const { reset } = formMethods;

  useEffect(() => {
    reset(getDefaultForPermitForm(updatedPermitFormData));
  }, [updatedPermitFormData]);

  return {
    formData,
    formMethods,
  };
};
