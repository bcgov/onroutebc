import { useContext } from "react";
import { FieldValues, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import "./AmendPermitForm.scss";
import { TROS_PERMIT_DURATIONS } from "../../../constants/termOversizeConstants";
import { usePermitVehicleManagement } from "../../../hooks/usePermitVehicleManagement";
import { useAmendPermit } from "../hooks/useAmendPermit";
import { SnackBarContext } from "../../../../../App";
import { AmendPermitContext } from "../context/AmendPermitContext";
import { PermitForm } from "../../TermOversize/components/form/PermitForm";
import { Permit } from "../../../types/permit";
import { useCompanyInfoDetailsQuery } from "../../../../manageProfile/apiManager/hooks";
import { Breadcrumb } from "../../../../../common/components/breadcrumb/Breadcrumb";
import { AmendRevisionHistory } from "./form/AmendRevisionHistory";
import { AmendReason } from "./form/AmendReason";
import { Nullable } from "../../../../../common/types/common";
import { VehicleDetails } from "../../../types/application";
import { ERROR_ROUTES } from "../../../../../routes/constants";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import {
  dayjsToUtcStr,
  nowUtc,
} from "../../../../../common/helpers/formatDate";

import {
  AmendPermitFormData,
  mapFormDataToPermit,
  mapPermitToFormData,
} from "../types/AmendPermitFormData";

import {
  useAmendPermit as useAmendPermitMutation,
  useModifyAmendmentApplication,
} from "../../../hooks/hooks";

export const AmendPermitForm = () => {
  const {
    permit,
    permitFormData,
    permitHistory,
    setPermitFormData,
    currentStepIndex,
    next,
    goHome,
    getLinks,
  } = useContext(AmendPermitContext);

  const navigate = useNavigate();

  const { formData, formMethods } = useAmendPermit(
    currentStepIndex === 0,
    permitFormData,
  );

  //The name of this feature that is used for id's, keys, and associating form components
  const FEATURE = "amend-permit";

  const amendPermitMutation = useAmendPermitMutation();
  const modifyAmendmentMutation = useModifyAmendmentApplication();
  const snackBar = useContext(SnackBarContext);

  const {
    handleSaveVehicle,
    vehicleOptions,
    powerUnitSubTypes,
    trailerSubTypes,
  } = usePermitVehicleManagement(`${formData.companyId}`);

  const { handleSubmit, getValues } = formMethods;

  const companyInfoQuery = useCompanyInfoDetailsQuery(formData.companyId);
  const companyInfo = companyInfoQuery.data;

  // Helper method to return form field values as an Permit object
  const transformPermitFormData = (data: FieldValues) => {
    return {
      ...data,
      permitData: {
        ...data.permitData,
        vehicleDetails: {
          ...data.permitData.vehicleDetails,
          // Convert year to number here, as React doesn't accept valueAsNumber prop for input component
          year: !isNaN(Number(data.permitData.vehicleDetails.year))
            ? Number(data.permitData.vehicleDetails.year)
            : data.permitData.vehicleDetails.year,
        },
      },
    } as AmendPermitFormData;
  };

  // When "Continue" button is clicked
  const onContinue = async (data: FieldValues) => {
    const permitToBeAmended = transformPermitFormData(data);
    const vehicleData = permitToBeAmended.permitData.vehicleDetails;
    const savedVehicle = await handleSaveVehicle(vehicleData);

    // Save application before continuing
    await onSaveApplication(() => next(), savedVehicle);
  };

  const isSavePermitSuccessful = (status: number) =>
    status === 200 || status === 201;

  const onSaveSuccess = (responseData: Permit) => {
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: `Amendment application ${responseData.applicationNumber} created/updated.`,
      alertType: "success",
    });

    setPermitFormData(mapPermitToFormData(responseData));
  };

  const onSaveFailure = () => {
    navigate(ERROR_ROUTES.UNEXPECTED);
  };

  const onSaveApplication = async (
    additionalSuccessAction?: () => void,
    savedVehicleInventoryDetails?: Nullable<VehicleDetails>,
  ) => {
    if (
      !savedVehicleInventoryDetails &&
      typeof savedVehicleInventoryDetails !== "undefined"
    ) {
      // save vehicle to inventory failed (result is null), go to unexpected error page
      return onSaveFailure();
    }

    const formValues = getValues();
    const permitToBeAmended = transformPermitFormData(
      !savedVehicleInventoryDetails
        ? formValues
        : {
            ...formValues,
            permitData: {
              ...formValues.permitData,
              vehicleDetails: {
                ...savedVehicleInventoryDetails,
                saveVehicle: true,
              },
            },
          },
    );

    const shouldUpdateApplication =
      permitToBeAmended.permitId !== permit?.permitId;

    const response = shouldUpdateApplication
      ? await modifyAmendmentMutation.mutateAsync({
          applicationNumber: getDefaultRequiredVal(
            "",
            permitToBeAmended.applicationNumber,
          ),
          application: {
            ...permitToBeAmended,
            permitId: `${permitToBeAmended.permitId}`,
            permitData: {
              ...permitToBeAmended.permitData,
              companyName: getDefaultRequiredVal(
                "",
                permitToBeAmended.permitData.companyName,
              ),
              clientNumber: getDefaultRequiredVal(
                "",
                permitToBeAmended.permitData.clientNumber,
              ),
            },
          },
        })
      : await amendPermitMutation.mutateAsync(
          mapFormDataToPermit(permitToBeAmended) as Permit,
        );

    if (isSavePermitSuccessful(response.status)) {
      const responseData = response.data;
      onSaveSuccess(responseData as Permit);
      additionalSuccessAction?.();
    } else {
      onSaveFailure();
    }
  };

  const revisionHistory = permitHistory
    .filter((history) => history.comment && history.transactionSubmitDate)
    .map((history) => ({
      permitId: history.permitId,
      comment: getDefaultRequiredVal("", history.comment),
      name: history.commentUsername,
      revisionDateTime: getDefaultRequiredVal(
        dayjsToUtcStr(nowUtc()),
        history.transactionSubmitDate,
      ),
    }));

  const permitOldDuration = getDefaultRequiredVal(
    30,
    permit?.permitData?.permitDuration,
  );
  const durationOptions = TROS_PERMIT_DURATIONS.filter(
    (duration) => duration.value <= permitOldDuration,
  );

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
          powerUnitSubTypes={powerUnitSubTypes}
          trailerSubTypes={trailerSubTypes}
          companyInfo={companyInfo}
          durationOptions={durationOptions}
        >
          <AmendRevisionHistory revisionHistory={revisionHistory} />
          <AmendReason feature={FEATURE} />
        </PermitForm>
      </FormProvider>
    </div>
  );
};
