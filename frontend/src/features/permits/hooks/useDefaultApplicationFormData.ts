import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Application, ApplicationFormData } from "../types/application";
import { BCeIDUserDetailContext } from "../../../common/authentication/OnRouteBCContext";
import { CompanyProfile } from "../../manageProfile/types/manageProfile";
import { Nullable } from "../../../common/types/common";
import { PermitType } from "../types/PermitType";
import {
  applyLCVToApplicationFormData,
  getDefaultValues,
} from "../helpers/getDefaultApplicationFormData";

/**
 * Custom hook for populating the form using fetched application data, as well as current company id and user details.
 * This also involves resetting certain form values whenever new/updated application data is fetched.
 * @param permitType Permit type for the application
 * @param isLcvDesignated Whether or not the company is designated to use LCV for permits
 * @param companyInfo Company information for filling out the form
 * @param applicationData Application data received to fill out the form, preferrably from ApplicationContext/backend
 * @param userDetails User details for filling out the form
 * @returns Current application form data and methods to manage the form
 */
export const useDefaultApplicationFormData = (
  permitType: PermitType,
  isLcvDesignated: boolean,
  companyInfo: Nullable<CompanyProfile>,
  applicationData?: Nullable<Application>,
  userDetails?: BCeIDUserDetailContext,
) => {
  // Used to populate/initialize the form with
  // This will be updated whenever new application, company, and user data is fetched
  const initialFormData = useMemo(() => applyLCVToApplicationFormData(
    getDefaultValues(
      permitType,
      companyInfo,
      applicationData,
      userDetails,
    ),
    isLcvDesignated,
  ), [
    permitType,
    companyInfo,
    applicationData,
    userDetails,
    isLcvDesignated,
  ]);

  // Register default values with react-hook-form
  const formMethods = useForm<ApplicationFormData>({
    defaultValues: initialFormData,
    reValidateMode: "onBlur",
  });

  const { watch, reset } = formMethods;
  const currentFormData = watch();

  // Reset the form with updated default form data whenever fetched data changes
  useEffect(() => {
    reset(initialFormData);
  }, [initialFormData]);

  return {
    initialFormData,
    currentFormData,
    formMethods,
  };
};
