import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Nullable } from "../../../../../common/types/common";
import { Permit } from "../../../types/permit";
import { Application } from "../../../types/application";
import { applyWhenNotNullable } from "../../../../../common/helpers/util";
import { CompanyProfile } from "../../../../manageProfile/types/manageProfile";
import {
  AmendPermitFormData,
  getDefaultFormDataFromApplication,
  getDefaultFormDataFromPermit,
} from "../types/AmendPermitFormData";

export const useAmendPermitForm = (
  repopulateFormData: boolean,
  companyInfo: Nullable<CompanyProfile>,
  permit?: Nullable<Permit>,
  amendmentApplication?: Nullable<Application>,
) => {
  // Default form data values to populate the amend form with
  const permitFormDefaultValues = () => {
    if (amendmentApplication) {
      return getDefaultFormDataFromApplication(
        companyInfo,
        amendmentApplication,
      );
    }

    // Permit doesn't have existing amendment application
    // Populate form data with permit, with initial empty comment
    return getDefaultFormDataFromPermit(
      companyInfo,
      applyWhenNotNullable(
        (p) => ({
          ...p,
          comment: "",
        }),
        permit,
      ),
    );
  };

  // Permit form data, populated whenever permit is fetched
  const [formData, setFormData] = useState<AmendPermitFormData>(
    permitFormDefaultValues(),
  );

  useEffect(() => {
    setFormData(permitFormDefaultValues());
  }, [amendmentApplication, permit, repopulateFormData, companyInfo]);

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
