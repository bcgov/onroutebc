import { useState, useEffect, useContext } from "react";

import { Application } from "../types/application";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext"; 
import { useForm } from "react-hook-form";
import { getDefaultContactDetails, getDefaultMailingAddress, getDefaultValues, getDefaultVehicleDetails } from "../helpers/getDefaultApplicationFormData";
import { useCompanyInfoQuery } from "../../manageProfile/apiManager/hooks";

export const useDefaultApplicationFormData = (applicationData?: Application) => {
  const { companyId, userDetails } = useContext(OnRouteBCContext);
  const companyInfoQuery = useCompanyInfoQuery();

  const [defaultApplicationDataValues, setDefaultApplicationDataValues] = useState<Application>(
    getDefaultValues(applicationData, companyId, userDetails)
  );

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

  // Default values to register with React Hook Forms
  // Use saved data from the TROS application context, otherwise use empty or undefined values
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
