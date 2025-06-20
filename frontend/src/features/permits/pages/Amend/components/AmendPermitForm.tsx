import { useContext, useMemo, useState } from "react";
import { FieldValues, FormProvider } from "react-hook-form";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Dayjs } from "dayjs";

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
import {
  isNull,
  isUndefined,
  Nullable,
  ORBC_FORM_FEATURES,
} from "../../../../../common/types/common";
import { ERROR_ROUTES } from "../../../../../routes/constants";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";
import { PermitVehicleDetails } from "../../../types/PermitVehicleDetails";
import { getDatetimes } from "./helpers/getDatetimes";
import { PAST_START_DATE_STATUSES } from "../../../../../common/components/form/subFormComponents/CustomDatePicker";
import { useFetchLOAs } from "../../../../settings/hooks/LOA";
import { useFetchSpecialAuthorizations } from "../../../../settings/hooks/specialAuthorizations";
import {
  filterLOAsForPermitType,
  filterNonExpiredLOAs,
} from "../../../helpers/permitLOA";
import { usePolicyEngine } from "../../../../policy/hooks/usePolicyEngine";
import { Loading } from "../../../../../common/pages/Loading";
import { serializePermitVehicleDetails } from "../../../helpers/serialize/serializePermitVehicleDetails";
import { serializeForUpdateApplication } from "../../../helpers/serialize/serializeApplication";
import { requiredPowerUnit } from "../../../../../common/helpers/validationMessages";
import { isTermPermitType, PERMIT_TYPES } from "../../../types/PermitType";
import { dayjsToUtcStr, getStartOfDate, now } from "../../../../../common/helpers/formatDate";

import {
  useAmendPermit,
  useModifyAmendmentApplication,
} from "../../../hooks/hooks";

import {
  durationOptionsForPermitType,
  minDurationForPermitType,
} from "../../../helpers/dateSelection";
import OnRouteBCContext from "../../../../../common/authentication/OnRouteBCContext";
import { shouldOverridePolicyInvalidSubtype } from "../../../helpers/vehicles/subtypes/shouldOverridePolicyInvalidSubtype";
import { useMemoizedArray } from "../../../../../common/hooks/useMemoizedArray";

const FEATURE = ORBC_FORM_FEATURES.AMEND_PERMIT;

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
  const companyId: number = applyWhenNotNullable(
    (id) => Number(id),
    companyIdParam,
    0,
  );
  const navigate = useNavigate();

  const { data: activeLOAs } = useFetchLOAs(companyId, false);
  const companyLOAs = useMemo(
    () => getDefaultRequiredVal([], activeLOAs),
    [activeLOAs],
  );

  const { idirUserDetails } = useContext(OnRouteBCContext);

  const isStaffUser = Boolean(idirUserDetails?.userRole);

  const { data: companyInfo } = useCompanyInfoDetailsQuery(companyId);
  const { data: specialAuthorizations } =
    useFetchSpecialAuthorizations(companyId);
  const isLcvDesignated = Boolean(specialAuthorizations?.isLcvAllowed);

  const {
    handleSaveVehicle,
    allVehiclesFromInventory,
    powerUnitSubtypeNamesMap,
    trailerSubtypeNamesMap,
  } = usePermitVehicleManagement(companyId);

  const policyEngine = usePolicyEngine(specialAuthorizations);

  const { initialFormData, formData, formMethods } = useAmendPermitForm({
    repopulateFormData: currentStepIndex === 0,
    isLcvDesignated,
    companyLOAs,
    inventoryVehicles: allVehiclesFromInventory,
    companyInfo,
    permit,
    amendmentApplication,
    policyEngine,
  });

  const { createdDateTime, updatedDateTime } = getDatetimes(
    amendmentApplication,
    permit,
  );

  // Applicable LOAs must be:
  // 1. Applicable for the current permit type
  // 2. Have expiry date that is on or after the start date for an application
  const applicableLOAs = filterNonExpiredLOAs(
    filterLOAsForPermitType(companyLOAs, formData.permitType),
    formData.permitData.startDate,
  );

  const { mutateAsync: createAmendment } = useAmendPermit(companyId);
  const { mutateAsync: modifyAmendment } = useModifyAmendmentApplication();
  const snackBar = useContext(SnackBarContext);

  const { handleSubmit } = formMethods;

  const [policyViolations, setPolicyViolations] = useState<
    Record<string, string>
  >({});

  const clearViolation = (fieldReference: string) => {
    if (fieldReference in policyViolations) {
      const otherViolations = Object.entries(policyViolations).filter(
        ([fieldRef]) => fieldRef !== fieldReference,
      );

      setPolicyViolations(Object.fromEntries(otherViolations));
    }
  };

  const triggerPolicyValidation = async () => {
    const validationResults = await policyEngine?.validate(
      serializeForUpdateApplication(formData),
    );

    const violations = getDefaultRequiredVal(
      [],
      validationResults?.violations
        .filter(({ fieldReference }) => Boolean(fieldReference))
        .map((violation) => ({
          fieldReference: violation.fieldReference as string,
          message: violation.message,
        })),
    ).concat(
      formData.permitType === PERMIT_TYPES.STOS &&
        !formData.permitData.vehicleDetails.vin
        ? [
            {
              fieldReference: "permitData.vehicleDetails",
              message: requiredPowerUnit(),
            },
          ]
        : [],
    );

    const policyViolations = Object.fromEntries(
      violations.map(({ fieldReference, message }) => [
        fieldReference,
        message,
      ]),
    );

    // Check if vehicle subtype violations can be overriden by LOA
    const updatedViolations = shouldOverridePolicyInvalidSubtype(
      policyViolations,
      formData.permitData.vehicleDetails.vehicleSubType,
      formData.permitData.loas,
    ) ? Object.fromEntries(
      Object.entries(policyViolations)
        .filter(([fieldReference]) => fieldReference !== "permitData.vehicleDetails.vehicleSubType"),
    ) : policyViolations;

    setPolicyViolations(updatedViolations);
    return updatedViolations;
  };

  // When "Continue" button is clicked
  const onContinue = async (data: FieldValues) => {
    const updatedViolations = await triggerPolicyValidation();
    // prevent CV client continuing if there are policy engine validation errors
    if (Object.keys(updatedViolations).length > 0 && !isStaffUser) {
      return;
    }

    const vehicleData = serializePermitVehicleDetails(
      data.permitData.vehicleDetails,
    );
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
          applicationId: getDefaultRequiredVal("", permitToBeAmended.permitId),
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

  const currentDate = now();

  const revisionHistory = permitHistory
    .filter((history) => history.comment && history.transactionSubmitDate)
    .map((history) => ({
      permitId: history.permitId,
      comment: getDefaultRequiredVal("", history.comment),
      name: history.commentUsername,
      revisionDateTime: getDefaultRequiredVal(
        dayjsToUtcStr(currentDate),
        history.transactionSubmitDate,
      ),
    }));

  const oldPermitStartDate: Dayjs = applyWhenNotNullable(
    (dateStr) => getStartOfDate(dateStr),
    permit?.permitData?.startDate,
    currentDate,
  );

  const permitOldDuration = getDefaultRequiredVal(
    minDurationForPermitType(formData.permitType),
    permit?.permitData?.permitDuration,
  );

  const durationOptions = durationOptionsForPermitType(
    formData.permitType,
    true,
  );
  
  // Term permits only allow duration to be shortened
  // All other permit types can shorten or lengthen duration as needed
  const amendmentDurationOptions = useMemoizedArray(
    isTermPermitType(formData.permitType)
      ? durationOptions.filter((duration) => duration.value <= permitOldDuration)
      : durationOptions,
    durationOption => durationOption.value,
    (durationOption1, durationOption2) => durationOption1.value === durationOption2.value,
  );

  const applicationFormContextData = useMemo(
    () => ({
      initialFormData,
      formData,
      policyEngine,
      durationOptions: amendmentDurationOptions,
      allVehiclesFromInventory,
      powerUnitSubtypeNamesMap,
      trailerSubtypeNamesMap,
      isLcvDesignated,
      feature: FEATURE,
      companyInfo,
      isAmendAction: true,
      isStaff: true,
      oldPermitStartDate,
      createdDateTime,
      updatedDateTime,
      pastStartDateStatus: PAST_START_DATE_STATUSES.WARNING,
      companyLOAs: applicableLOAs,
      revisionHistory,
      policyViolations,
      onLeave: undefined,
      onSave: undefined,
      onCancel: goHome,
      onContinue: handleSubmit(onContinue),
      triggerPolicyValidation,
      clearViolation,
    }),
    [
      initialFormData,
      formData,
      policyEngine,
      amendmentDurationOptions,
      allVehiclesFromInventory,
      powerUnitSubtypeNamesMap,
      trailerSubtypeNamesMap,
      isLcvDesignated,
      companyInfo,
      oldPermitStartDate,
      createdDateTime,
      updatedDateTime,
      applicableLOAs,
      revisionHistory,
      policyViolations,
      goHome,
      onContinue,
      triggerPolicyValidation,
      clearViolation,
    ],
  );

  if (isUndefined(policyEngine)) return <Loading />;
  if (isNull(policyEngine)) return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;

  return (
    <div className="amend-permit-form">
      <Breadcrumb links={getLinks()} />

      <FormProvider {...formMethods}>
        <ApplicationFormContext.Provider value={applicationFormContextData}>
          <PermitForm />
        </ApplicationFormContext.Provider>
      </FormProvider>
    </div>
  );
};
