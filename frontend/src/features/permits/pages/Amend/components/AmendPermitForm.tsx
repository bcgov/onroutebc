import { useContext } from "react";
import { FieldValues, FormProvider } from "react-hook-form";

import "./AmendPermitForm.scss";
import { useAmendPermit as useAmendPermitMutation } from "../../../hooks/hooks";
import { usePermitVehicleManagement } from "../../../hooks/usePermitVehicleManagement";
import { useAmendPermit } from "../hooks/useAmendPermit";
import { SnackBarContext } from "../../../../../App";
import { AmendPermitContext } from "../context/AmendPermitContext";
import { PermitForm } from "../../TermOversize/components/form/PermitForm";
import { ReadPermitDto } from "../../../types/permit";
import { useCompanyInfoDetailsQuery } from "../../../../manageProfile/apiManager/hooks";
import { 
  AmendPermitFormData, 
  mapFormDataToPermit, 
  mapPermitToFormData,
} from "../types/AmendPermitFormData";
import { Breadcrumb } from "../../../../../common/components/breadcrumb/Breadcrumb";

export const AmendPermitForm = () => {
  const { 
    updatedPermitFormData, 
    setPermitFormData,
    next,
    goHome,
    getLinks,
  } = useContext(AmendPermitContext);

  const { formData, formMethods } = useAmendPermit(updatedPermitFormData);

  //The name of this feature that is used for id's, keys, and associating form components
  const FEATURE = "amend-permit";

  const amendPermitMutation = useAmendPermitMutation();
  const snackBar = useContext(SnackBarContext);

  const {
    handleSaveVehicle,
    vehicleOptions,
    powerUnitTypes,
    trailerTypes,
  } = usePermitVehicleManagement();

  const { handleSubmit, getValues } = formMethods;

  const companyInfoQuery = useCompanyInfoDetailsQuery(formData.companyId);
  const companyInfo = companyInfoQuery.data;

  // Helper method to return form field values as an ReadPermitDto object
  const permitFormData = (data: FieldValues) => {
    return {
      ...data,
      permitData: {
        ...data.permitData,
        vehicleDetails: {
          ...data.permitData.vehicleDetails,
          // Convert year to number here, as React doesn't accept valueAsNumber prop for input component
          year: !isNaN(Number(data.permitData.vehicleDetails.year)) ? 
            Number(data.permitData.vehicleDetails.year) : data.permitData.vehicleDetails.year
        }
      }
    } as AmendPermitFormData;
  };

  // When "Continue" button is clicked
  const onContinue = async (data: FieldValues) => {
    const permitToBeAmended = permitFormData(data);
    const vehicleData = permitToBeAmended.permitData.vehicleDetails;
    handleSaveVehicle(vehicleData);

    // Save application before continuing
    await onSaveApplication(() => next());
  };

  const isSavePermitSuccessful = (status: number) => status === 200 || status === 201;

  const onSaveSuccess = (responseData: ReadPermitDto) => {
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: `Permit ${responseData.permitNumber} amended successfully.`,
      alertType: "success",
    });

    setPermitFormData(mapPermitToFormData(responseData));
  };

  const onSaveFailure = () => {
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: `An unexpected error occured`,
      alertType: "error",
    });
  };

  const onSaveApplication = async (additionalSuccessAction?: () => void) => {
    const permitToBeAmended = permitFormData(getValues());
    console.log(mapFormDataToPermit(permitToBeAmended));
    /*
    const response = await amendPermitMutation.mutateAsync(
      mapFormDataToPermit(permitToBeAmended)
    );
    
    if (isSavePermitSuccessful(response.status)) {
      const responseData = response.data;
      onSaveSuccess(responseData as ReadPermitDto);
      additionalSuccessAction?.();
    } else {
      onSaveFailure();
    }
    */
  };

  return (
    <div className="amend-permit-form">
      <Breadcrumb links={getLinks()} />

      <FormProvider {...formMethods}>
        <PermitForm 
          feature={FEATURE}
          onCancel={goHome}
          onContinue={handleSubmit(onContinue)}
          isAmendAction={true}
          permitType={formData.permitType}
          applicationNumber={formData.applicationNumber}
          permitNumber={formData.permitNumber}
          createdDateTime={formData.createdDateTime}
          updatedDateTime={formData.updatedDateTime}
          permitStartDate={formData.permitData.startDate}
          permitDuration={formData.permitData.permitDuration}
          permitCommodities={formData.permitData.commodities}
          vehicleDetails={formData.permitData.vehicleDetails}
          vehicleOptions={vehicleOptions}
          powerUnitTypes={powerUnitTypes}
          trailerTypes={trailerTypes}
          companyInfo={companyInfo}
        />
      </FormProvider>
    </div>
  );
};
