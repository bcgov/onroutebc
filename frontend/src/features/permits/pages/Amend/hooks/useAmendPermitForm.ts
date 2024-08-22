import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Nullable } from "../../../../../common/types/common";
import { Permit } from "../../../types/permit";
import { Application } from "../../../types/application";
import { applyWhenNotNullable } from "../../../../../common/helpers/util";
import { CompanyProfile } from "../../../../manageProfile/types/manageProfile";
import { applyLCVToApplicationFormData } from "../../../helpers/getDefaultApplicationFormData";
import {
  AmendPermitFormData,
  getDefaultFormDataFromApplication,
  getDefaultFormDataFromPermit,
} from "../types/AmendPermitFormData";

export const useAmendPermitForm = (
  repopulateFormData: boolean,
  isLcvDesignated: boolean,
  companyInfo: Nullable<CompanyProfile>,
  permit?: Nullable<Permit>,
  amendmentApplication?: Nullable<Application>,
) => {
  // Default form data values to populate the amend form with
  const defaultFormData = useMemo(() => {
    if (amendmentApplication) {
      return applyLCVToApplicationFormData(
        getDefaultFormDataFromApplication(
          companyInfo,
          amendmentApplication,
        ),
        isLcvDesignated,
      );
    }

    // Permit doesn't have existing amendment application
    // Populate form data with permit, with initial empty comment
    return applyLCVToApplicationFormData(
      getDefaultFormDataFromPermit(
        companyInfo,
        applyWhenNotNullable(
          (p) => ({
            ...p,
            comment: "",
          }),
          permit,
        ),
      ),
      isLcvDesignated,
    );
  }, [
    amendmentApplication,
    permit,
    repopulateFormData,
    companyInfo,
    isLcvDesignated,
  ]);

  // Register default values with react-hook-form
  const formMethods = useForm<AmendPermitFormData>({
    defaultValues: defaultFormData,
    reValidateMode: "onBlur",
  });

  const { reset, watch } = formMethods;
  const formData = watch();

  useEffect(() => {
    reset(defaultFormData);
  }, [defaultFormData]);

  return {
    formData,
    formMethods,
  };
};
