import { useContext } from "react";
import { FieldValues, FormProvider } from "react-hook-form";

import "./AmendPermitForm.scss";
import { useAmendPermit as useAmendPermitMutation, useModifyAmendmentApplication } from "../../../hooks/hooks";
import { usePermitVehicleManagement } from "../../../hooks/usePermitVehicleManagement";
import { useAmendPermit } from "../hooks/useAmendPermit";
import { SnackBarContext } from "../../../../../App";
import { AmendPermitContext } from "../context/AmendPermitContext";
import { PermitForm } from "../../TermOversize/components/form/PermitForm";
import { ReadPermitDto } from "../../../types/permit";
import { useCompanyInfoDetailsQuery } from "../../../../manageProfile/apiManager/hooks";
import { Breadcrumb } from "../../../../../common/components/breadcrumb/Breadcrumb";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { 
  AmendPermitFormData, 
  mapFormDataToPermit, 
  mapPermitToFormData,
} from "../types/AmendPermitFormData";

export const AmendPermitForm = () => {
  const { 
    permit,
    permitFormData, 
    setPermitFormData,
    currentStepIndex,
    next,
    goHome,
    getLinks,
  } = useContext(AmendPermitContext);

  const { formData, formMethods } = useAmendPermit(currentStepIndex === 0, permitFormData);

  //The name of this feature that is used for id's, keys, and associating form components
  const FEATURE = "amend-permit";

  const amendPermitMutation = useAmendPermitMutation();
  const modifyAmendmentMutation = useModifyAmendmentApplication();
  const snackBar = useContext(SnackBarContext);

  const {
    handleSaveVehicle,
    vehicleOptions,
    powerUnitTypes,
    trailerTypes,
  } = usePermitVehicleManagement(`${formData.companyId}`);

  const { handleSubmit, getValues } = formMethods;

  const companyInfoQuery = useCompanyInfoDetailsQuery(formData.companyId);
  const companyInfo = companyInfoQuery.data;

  // Helper method to return form field values as an ReadPermitDto object
  const transformPermitFormData = (data: FieldValues) => {
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
    const permitToBeAmended = transformPermitFormData(data);
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
      message: `Amendment application ${responseData.applicationNumber} created/updated.`,
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
    const permitToBeAmended = transformPermitFormData(getValues());
    const shouldUpdateApplication = permitToBeAmended.permitId !== permit?.permitId;
    const response = shouldUpdateApplication ? await modifyAmendmentMutation.mutateAsync({
      applicationNumber: permitToBeAmended.applicationNumber,
      application: {
        ...permitToBeAmended,
        permitId: `${permitToBeAmended.permitId}`,
        previousRevision: applyWhenNotNullable(
          (prevRev) => `${prevRev}`,
          permitToBeAmended.previousRevision
        ),
        permitData: {
          ...permitToBeAmended.permitData,
          companyName: getDefaultRequiredVal("", permitToBeAmended.permitData.companyName),
          clientNumber: getDefaultRequiredVal("", permitToBeAmended.permitData.clientNumber),
        }
      },
    }) : await amendPermitMutation.mutateAsync(
      mapFormDataToPermit(permitToBeAmended)
    );
    
    if (isSavePermitSuccessful(response.status)) {
      const responseData = response.data;
      onSaveSuccess(responseData as ReadPermitDto);
      additionalSuccessAction?.();
    } else {
      onSaveFailure();
    }
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
