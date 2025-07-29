import { Controller, FormProvider } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import { Button, FormControl } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./VoidPermitForm.scss";
import { useVoidPermitForm } from "../hooks/useVoidPermitForm";
import { VoidPermitHeader } from "./VoidPermitHeader";
import { RevokeDialog } from "./RevokeDialog";
import {
  calculateAmountForVoid,
  calculateNetAmount,
} from "../../../helpers/feeSummary";
import { VoidPermitFormData } from "../types/VoidPermit";
import { useVoidOrRevokePermit } from "../hooks/useVoidOrRevokePermit";
import { mapToRevokeRequestData } from "../helpers/mapper";
import { ORBC_FORM_FEATURES } from "../../../../../common/types/common";
import { hasPermitsActionFailed } from "../../../helpers/permitState";
import { usePermitHistoryQuery } from "../../../hooks/hooks";
import { isValidTransaction } from "../../../helpers/payment";
import {
  invalidEmail,
  requiredMessage,
} from "../../../../../common/helpers/validationMessages";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";

import { CustomFormComponent } from "../../../../../common/components/form/CustomFormComponents";
import { usePermissionMatrix } from "../../../../../common/authentication/PermissionMatrix";
import { AmendOrVoidFeeSummary } from "../../../components/amendOrVoidFeeSummary/AmendOrVoidFeeSummary";
import { VoidPermitContext } from "../context/VoidPermitContext";

const FEATURE = ORBC_FORM_FEATURES.VOID_PERMIT;

export const VoidPermitForm = () => {
  const { permit, handleFail, goHomeSuccess, goHome } =
    useContext(VoidPermitContext);
  const [openRevokeDialog, setOpenRevokeDialog] = useState<boolean>(false);
  const { formMethods, permitId, setVoidPermitData, next } =
    useVoidPermitForm();

  const { mutation: revokePermitMutation, voidResults } =
    useVoidOrRevokePermit();
  const { companyId: companyIdParam } = useParams();

  const companyId: number = getDefaultRequiredVal(
    0,
    permit?.companyId,
    applyWhenNotNullable((id) => Number(id), companyIdParam),
  );

  const originalPermitId = getDefaultRequiredVal("", permit?.originalPermitId);

  const { data: permitHistory } = usePermitHistoryQuery(
    companyId,
    originalPermitId,
  );

  const transactionHistory = getDefaultRequiredVal([], permitHistory).filter(
    (history) =>
      isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
  );

  const amountToRefund =
    !permit || transactionHistory.length === 0
      ? 0
      : -1 * calculateAmountForVoid(permit, transactionHistory);

  const currentPermitValue = calculateNetAmount(transactionHistory);

  // amountToRefund is a negative number so we add here rather than subtract
  const newPermitValue = currentPermitValue + amountToRefund;

  useEffect(() => {
    const revokeFailed = hasPermitsActionFailed(voidResults);
    if (revokeFailed) {
      handleFail();
    } else if (getDefaultRequiredVal(0, voidResults?.success?.length) > 0) {
      // Revoke action was successful and has results
      setOpenRevokeDialog(false);
      goHomeSuccess();
    }
  }, [voidResults]);

  const { control, getValues, handleSubmit } = formMethods;

  const handleContinue = () => {
    const formValues = getValues();
    setVoidPermitData(formValues);
    next();
  };

  const canRevokePermit = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "GLOBAL_SEARCH",
      permissionMatrixFunctionKey: "REVOKE_PERMIT",
    },
  });

  const handleOpenRevokeDialog = () => {
    setOpenRevokeDialog(true);
  };

  const handleCancelRevoke = () => {
    setOpenRevokeDialog(false);
  };

  const handleRevoke = (revokeData: VoidPermitFormData) => {
    revokePermitMutation.mutate({
      permitId,
      voidData: mapToRevokeRequestData(revokeData),
    });
  };

  const voidReasonRules = {
    required: {
      value: true,
      message: requiredMessage(),
    },
  };

  return (
    <FormProvider {...formMethods}>
      <VoidPermitHeader permit={permit} />
      <div className="void-permit__form">
        <div className="form-section form-section--send">
          <div className="form-section__label">Send Permit and Receipt to</div>

          <div className="form-section__input-area">
            <CustomFormComponent
              type="input"
              feature={FEATURE}
              disabled={true}
              readOnly={true}
              options={{
                name: "email",
                rules: {
                  required: { value: true, message: requiredMessage() },
                  validate: {
                    validateEmail: (email: string) =>
                      isEmail(email) || invalidEmail(),
                  },
                },
                label: "Company Email",
              }}
              className="void-input void-input--email"
            />

            <CustomFormComponent
              type="input"
              feature={FEATURE}
              options={{
                name: "additionalEmail",
                rules: {
                  required: false,
                  validate: {
                    validateEmail: (email?: string) =>
                      !email ||
                      email.length === 0 ||
                      isEmail(email) ||
                      invalidEmail(),
                  },
                },
                label: "Additional Email",
              }}
              className="void-input void-input--additional-email"
            />
          </div>
        </div>

        <div className="form-section form-section--reason">
          <div className="form-section__label">Reason for Voiding</div>

          <div className="form-section__input-area">
            <div className="reason-container">
              <div className="reason-container__left">
                <Controller
                  name="reason"
                  control={control}
                  rules={voidReasonRules}
                  render={({ fieldState: { invalid } }) => (
                    <FormControl error={invalid}>
                      <CustomFormComponent
                        type="textarea"
                        feature={FEATURE}
                        options={{
                          name: "reason",
                          rules: voidReasonRules,
                          width: "100%",
                        }}
                      />
                    </FormControl>
                  )}
                />

                <AmendOrVoidFeeSummary
                  currentPermitValue={`${currentPermitValue}`}
                  newPermitValue={`${newPermitValue}`}
                  amountToRefund={`${amountToRefund}`}
                />
              </div>

              {canRevokePermit && (
                <div className="reason-container__right">
                  <div className="revoke">
                    <div className="revoke__header">Revoke this permit?</div>

                    <div className="revoke__body">
                      <div className="revoke__msg">
                        Revoking a permit is a severe action that{" "}
                        <span className="revoke__msg--bold">
                          cannot be reversed.
                        </span>{" "}
                        There are{" "}
                        <span className="revoke__msg--bold">no refunds</span>{" "}
                        for revoked permits.
                      </div>

                      <Button
                        className="revoke__btn"
                        onClick={handleOpenRevokeDialog}
                      >
                        Revoke Permit
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-section form-section--submit">
          <div className="form-section__label"></div>
          <div className="form-section__input-area">
            <Button
              key="cancel-void-button"
              aria-label="Cancel"
              variant="contained"
              color="tertiary"
              className="void-permit-button void-permit-button--cancel"
              onClick={goHome}
              data-testid="cancel-void-permit-button"
            >
              Cancel
            </Button>

            <Button
              key="continue-void-button"
              aria-label="Continue"
              variant="contained"
              color="primary"
              onClick={handleSubmit(handleContinue)}
              className="void-permit-button void-permit-button--continue"
              data-testid="continue-void-permit-button"
            >
              Continue
            </Button>
          </div>
        </div>

        {openRevokeDialog ? (
          <RevokeDialog
            voidPermitData={getValues()}
            showDialog={openRevokeDialog}
            onClose={handleCancelRevoke}
            onRevoke={handleRevoke}
          />
        ) : null}
      </div>
    </FormProvider>
  );
};
