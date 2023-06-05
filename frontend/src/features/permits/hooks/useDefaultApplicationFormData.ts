import { useState, useEffect, useContext } from "react";

import { Application } from "../types/application";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext"; 
import { useForm } from "react-hook-form";
import { getDefaultContactDetails, getDefaultMailingAddress, getDefaultValues, getDefaultVehicleDetails } from "../helpers/getDefaultApplicationFormData";
import { useCompanyInfoQuery } from "../../manageProfile/apiManager/hooks";

/**
 * Custom hook used to fetch application data and populate the form, as well as fetching current company id and user details.
 * This also involves resetting certain form values when new/updated application data is received through ApplicationContext
 * @param applicationData Application data received to fill out the form, preferrably from ApplicationContext/backend
 * @returns current companyId, user details, default application data values, its setter method, and methods to manage the form
 */
export const useDefaultApplicationFormData = (applicationData?: Application) => {
  const { companyId, userDetails } = useContext(OnRouteBCContext);
  const companyInfoQuery = useCompanyInfoQuery();

  // initialize the entire form data with default values
  // Use default values (saved data from the TROS application context, or empty values)
  const [defaultApplicationDataValues, setDefaultApplicationDataValues] = useState<Application>(
    getDefaultValues(applicationData, companyId, userDetails) 
  );

  // Update contact details form fields whenever these values are updated
  const contactDetailsDepArray = [
    applicationData?.permitData?.contactDetails?.firstName,
    userDetails?.firstName,
    applicationData?.permitData?.contactDetails?.lastName,
    userDetails?.lastName,
    applicationData?.permitData?.contactDetails?.phone1,
    userDetails?.phone1,
    applicationData?.permitData?.contactDetails?.phone1Extension,
    applicationData?.permitData?.contactDetails?.phone2,
    applicationData?.permitData?.contactDetails?.phone2Extension,
    applicationData?.permitData?.contactDetails?.email,
    userDetails?.email,
    applicationData?.permitData?.contactDetails?.fax,
  ];

  // Update mailing address form fields whenever these values are updated
  const mailingAddressDepArray = [
    applicationData?.permitData?.mailingAddress?.addressLine1,
    applicationData?.permitData?.mailingAddress?.addressLine2,
    applicationData?.permitData?.mailingAddress?.city,
    applicationData?.permitData?.mailingAddress?.countryCode,
    applicationData?.permitData?.mailingAddress?.provinceCode,
    applicationData?.permitData?.mailingAddress?.postalCode,
    companyInfoQuery.data?.mailingAddress?.addressLine1,
    companyInfoQuery.data?.mailingAddress?.addressLine2,
    companyInfoQuery.data?.mailingAddress?.city,
    companyInfoQuery.data?.mailingAddress?.countryCode,
    companyInfoQuery.data?.mailingAddress?.provinceCode,
    companyInfoQuery.data?.mailingAddress?.postalCode,
  ];

  // update vehicle details form fields whenever these values are updated
  const vehicleDetailsDepArray = [
    applicationData?.permitData?.vehicleDetails?.unitNumber,
    applicationData?.permitData?.vehicleDetails?.vin,
    applicationData?.permitData?.vehicleDetails?.plate,
    applicationData?.permitData?.vehicleDetails?.make,
    applicationData?.permitData?.vehicleDetails?.year,
    applicationData?.permitData?.vehicleDetails?.countryCode,
    applicationData?.permitData?.vehicleDetails?.provinceCode,
    applicationData?.permitData?.vehicleDetails?.vehicleType,
    applicationData?.permitData?.vehicleDetails?.vehicleSubType,
    applicationData?.permitData?.vehicleDetails?.saveVehicle,
  ];

  // update the entire form whenever these values are updated
  const applicationFormDataDepArray = [
    companyId,
    applicationData?.applicationNumber,
    applicationData?.permitStatus,
    applicationData?.permitType,
    applicationData?.createdDateTime,
    applicationData?.updatedDateTime,
    applicationData?.permitData?.startDate,
    applicationData?.permitData?.permitDuration,
    applicationData?.permitData?.expiryDate,
    ...contactDetailsDepArray,
    ...mailingAddressDepArray,
    ...vehicleDetailsDepArray,
  ];

  useEffect(() => {
    setDefaultApplicationDataValues(
      getDefaultValues(applicationData, companyId, userDetails)
    );
  }, applicationFormDataDepArray);

  // Register default values with react-hook-form
  const formMethods = useForm<Application>({
    defaultValues: defaultApplicationDataValues,
    reValidateMode: "onBlur",
  });

  const { setValue } = formMethods;

  useEffect(() => {
    setValue(
      "permitData.contactDetails",
      getDefaultContactDetails(applicationData?.permitData?.contactDetails, userDetails)
    );
  }, contactDetailsDepArray);

  useEffect(() => {
    setValue(
      "permitData.mailingAddress",
      getDefaultMailingAddress(applicationData?.permitData?.mailingAddress, companyInfoQuery.data?.mailingAddress)
    );
  }, mailingAddressDepArray);

  useEffect(() => {
    setValue(
      "permitData.vehicleDetails", 
      getDefaultVehicleDetails(applicationData?.permitData?.vehicleDetails)
    );
  }, vehicleDetailsDepArray);

  return {
    companyId,
    userDetails,
    defaultApplicationDataValues,
    setDefaultApplicationDataValues,
    formMethods,
  };
};
