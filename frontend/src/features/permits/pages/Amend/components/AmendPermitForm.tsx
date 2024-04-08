import { useContext } from "react";
import { FieldValues, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import "./AmendPermitForm.scss";
import { PERMIT_DURATION_OPTIONS } from "../../../constants/constants";
import { usePermitVehicleManagement } from "../../../hooks/usePermitVehicleManagement";
import { useAmendPermitForm } from "../hooks/useAmendPermitForm";
import { SnackBarContext } from "../../../../../App";
import { AmendPermitContext } from "../context/AmendPermitContext";
import { PermitForm } from "../../Application/components/form/PermitForm";
import { Application } from "../../../types/application";
import { useCompanyInfoDetailsQuery } from "../../../../manageProfile/apiManager/hooks";
import { Breadcrumb } from "../../../../../common/components/breadcrumb/Breadcrumb";
import { AmendRevisionHistory } from "./form/AmendRevisionHistory";
import { AmendReason } from "./form/AmendReason";
import { Nullable } from "../../../../../common/types/common";
import { ERROR_ROUTES } from "../../../../../routes/constants";
import { getDefaultRequiredVal } from "../../../../../common/helpers/util";
import OnRouteBCContext from "../../../../../common/authentication/OnRouteBCContext";
import { PermitVehicleDetails } from "../../../types/PermitVehicleDetails";
import { AmendPermitFormData } from "../types/AmendPermitFormData";
import { getDatetimes } from "./helpers/getDatetimes";
import {
  dayjsToUtcStr,
  nowUtc,
} from "../../../../../common/helpers/formatDate";

import {
  useAmendPermit,
  useModifyAmendmentApplication,
} from "../../../hooks/hooks";

export const AmendPermitForm = () => {
  const {
    permit,
    amendmentApplication,
    permitHistory,
    setAmendmentApplication,
    currentStepIndex,
    next,
    goHome,
    getLinks,
  } = useContext(AmendPermitContext);

  const { companyLegalName } = useContext(OnRouteBCContext);

  const navigate = useNavigate();

  const { formData, formMethods } = useAmendPermitForm(
    currentStepIndex === 0,
    permit,
    amendmentApplication,
  );

  const { createdDateTime, updatedDateTime } = getDatetimes(amendmentApplication, permit);

  //The name of this feature that is used for id's, keys, and associating form components
  const FEATURE = "amend-permit";

  const amendPermitMutation = useAmendPermit();
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

  const onSaveSuccess = (responseData: Application) => {
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: `Amendment application ${responseData.applicationNumber} created/updated.`,
      alertType: "success",
    });

    setAmendmentApplication(responseData);
  };

  const onSaveFailure = () => {
    navigate(ERROR_ROUTES.UNEXPECTED);
  };

  const onSaveApplication = async (
    additionalSuccessAction?: () => void,
    savedVehicleInventoryDetails?: Nullable<PermitVehicleDetails>,
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
          application: permitToBeAmended,
        })
      : await amendPermitMutation.mutateAsync(
          permitToBeAmended,
        );

    if (response.application) {
      onSaveSuccess(response.application);
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
  const durationOptions = PERMIT_DURATION_OPTIONS.filter(
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
          permitNumber={permit?.permitNumber}
          createdDateTime={createdDateTime}
          updatedDateTime={updatedDateTime}
          permitStartDate={formData.permitData.startDate}
          permitDuration={formData.permitData.permitDuration}
          permitCommodities={formData.permitData.commodities}
          vehicleDetails={formData.permitData.vehicleDetails}
          vehicleOptions={vehicleOptions}
          powerUnitSubTypes={powerUnitSubTypes}
          trailerSubTypes={trailerSubTypes}
          companyInfo={companyInfo}
          durationOptions={durationOptions}
          doingBusinessAs={companyLegalName}
        >
          <AmendRevisionHistory revisionHistory={revisionHistory} />
          <AmendReason feature={FEATURE} />
        </PermitForm>
      </FormProvider>
    </div>
  );
};
