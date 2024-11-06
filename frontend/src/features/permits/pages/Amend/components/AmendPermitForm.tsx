import { useContext, useMemo } from "react";
import { FieldValues, FormProvider } from "react-hook-form";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import "./AmendPermitForm.scss";
import { usePermitVehicleManagement } from "../../../hooks/usePermitVehicleManagement";
import { useAmendPermitForm } from "../hooks/useAmendPermitForm";
import { SnackBarContext } from "../../../../../App";
import { AmendPermitContext } from "../context/AmendPermitContext";
import { PermitForm } from "../../Application/components/form/PermitForm";
import { Application } from "../../../types/application";
import { useCompanyInfoDetailsQuery } from "../../../../manageProfile/apiManager/hooks";
import { Breadcrumb } from "../../../../../common/components/breadcrumb/Breadcrumb";
import { ApplicationFormContext } from "../../../context/ApplicationFormContext";
import { isNull, isUndefined, Nullable } from "../../../../../common/types/common";
import { ERROR_ROUTES } from "../../../../../routes/constants";
import { applyWhenNotNullable, getDefaultRequiredVal } from "../../../../../common/helpers/util";
import { PermitVehicleDetails } from "../../../types/PermitVehicleDetails";
import { getDatetimes } from "./helpers/getDatetimes";
import { PAST_START_DATE_STATUSES } from "../../../../../common/components/form/subFormComponents/CustomDatePicker";
import { useFetchLOAs } from "../../../../settings/hooks/LOA";
import { useFetchSpecialAuthorizations } from "../../../../settings/hooks/specialAuthorizations";
import { filterLOAsForPermitType, filterNonExpiredLOAs } from "../../../helpers/permitLOA";
import { usePolicyEngine } from "../../../../policy/hooks/usePolicyEngine";
import { Loading } from "../../../../../common/pages/Loading";
import { serializePermitVehicleDetails } from "../../../helpers/serialize/serializePermitVehicleDetails";
import {
  dayjsToUtcStr,
  nowUtc,
} from "../../../../../common/helpers/formatDate";

import {
  useAmendPermit,
  useModifyAmendmentApplication,
} from "../../../hooks/hooks";

import {
  durationOptionsForPermitType,
  minDurationForPermitType,
} from "../../../helpers/dateSelection";

const FEATURE = "amend-permit";

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

  const { companyId: companyIdParam } = useParams();
  const companyId: number = applyWhenNotNullable(id => Number(id), companyIdParam, 0);
  const navigate = useNavigate();

  const { data: activeLOAs } = useFetchLOAs(companyId, false);
  const companyLOAs = useMemo(() => getDefaultRequiredVal(
    [],
    activeLOAs,
  ), [activeLOAs]);

  const { data: companyInfo } = useCompanyInfoDetailsQuery(companyId);
  const { data: specialAuthorizations } = useFetchSpecialAuthorizations(companyId);
  const isLcvDesignated = Boolean(specialAuthorizations?.isLcvAllowed);

  const {
    handleSaveVehicle,
    allVehiclesFromInventory,
    powerUnitSubtypeNamesMap,
    trailerSubtypeNamesMap,
  } = usePermitVehicleManagement(companyId);

  const policyEngine = usePolicyEngine();

  const {
    initialFormData,
    formData,
    formMethods,
  } = useAmendPermitForm(
    currentStepIndex === 0,
    isLcvDesignated,
    companyLOAs,
    allVehiclesFromInventory,
    companyInfo,
    permit,
    amendmentApplication,
    policyEngine,
  );

  const { createdDateTime, updatedDateTime } = getDatetimes(
    amendmentApplication,
    permit,
  );

  // Applicable LOAs must be:
  // 1. Applicable for the current permit type
  // 2. Have expiry date that is on or after the start date for an application
  const applicableLOAs = filterNonExpiredLOAs(
    filterLOAsForPermitType(
      companyLOAs,
      formData.permitType,
    ),
    formData.permitData.startDate,
  );
  
  const { mutateAsync: createAmendment } = useAmendPermit(companyId);
  const { mutateAsync: modifyAmendment } = useModifyAmendmentApplication();
  const snackBar = useContext(SnackBarContext);

  const { handleSubmit } = formMethods;

  // When "Continue" button is clicked
  const onContinue = async (data: FieldValues) => {
    const vehicleData = serializePermitVehicleDetails(data.permitData.vehicleDetails);
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
    if (isNull(savedVehicleInventoryDetails)) {
      return onSaveFailure();
    }

    const permitToBeAmended = !savedVehicleInventoryDetails
      ? formData
      : {
          ...formData,
          permitData: {
            ...formData.permitData,
            vehicleDetails: {
              ...savedVehicleInventoryDetails,
              saveVehicle: true,
            },
          },
        };

    const shouldUpdateApplication =
      permitToBeAmended.permitId !== permit?.permitId;

    const response = shouldUpdateApplication
      ? await modifyAmendment({
          applicationId: getDefaultRequiredVal(
            "",
            permitToBeAmended.permitId,
          ),
          application: permitToBeAmended,
          companyId,
        })
      : await createAmendment(permitToBeAmended);

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
    minDurationForPermitType(formData.permitType),
    permit?.permitData?.permitDuration,
  );

  const durationOptions = durationOptionsForPermitType(formData.permitType).filter(
    (duration) => duration.value <= permitOldDuration,
  );

  const applicationFormContextData = useMemo(() => ({
    initialFormData,
    formData,
    policyEngine,
    durationOptions,
    allVehiclesFromInventory,
    powerUnitSubtypeNamesMap,
    trailerSubtypeNamesMap,
    isLcvDesignated,
    feature: FEATURE,
    companyInfo,
    isAmendAction: true,
    createdDateTime,
    updatedDateTime,
    pastStartDateStatus: PAST_START_DATE_STATUSES.WARNING,
    companyLOAs: applicableLOAs,
    revisionHistory,
    onLeave: undefined,
    onSave: undefined,
    onCancel: goHome,
    onContinue: handleSubmit(onContinue),
  }), [
    initialFormData,
    formData,
    policyEngine,
    durationOptions,
    allVehiclesFromInventory,
    powerUnitSubtypeNamesMap,
    trailerSubtypeNamesMap,
    isLcvDesignated,
    companyInfo,
    createdDateTime,
    updatedDateTime,
    applicableLOAs,
    revisionHistory,
    goHome,
    onContinue,
  ]);

  if (isUndefined(policyEngine)) return <Loading />;
  if (isNull(policyEngine)) return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;

  return (
    <div className="amend-permit-form">
      <Breadcrumb links={getLinks()} />

      <FormProvider {...formMethods}>
        <ApplicationFormContext.Provider
          value={applicationFormContextData}
        >
          <PermitForm />
        </ApplicationFormContext.Provider>
      </FormProvider>
    </div>
  );
};
