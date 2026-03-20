import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button, Dialog, FormControl, FormLabel } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

import "./RevokeDialog.scss";
import { VoidPermitFormData } from "../types/VoidPermit";
import { requiredMessage } from "../../../../../common/helpers/validationMessages";
import { CustomFormComponent } from "../../../../../common/components/form/CustomFormComponents";
import { ORBC_FORM_FEATURES } from "../../../../../common/types/common";

const FEATURE = ORBC_FORM_FEATURES.REVOKE_PERMIT;

export const RevokeDialog = ({
  voidPermitData,
  showDialog,
  onClose,
  onRevoke,
}: {
  voidPermitData: VoidPermitFormData;
  showDialog: boolean;
  onClose: () => void;
  onRevoke: (revokeData: VoidPermitFormData) => void;
}) => {
  const formMethods = useForm<VoidPermitFormData>({
    defaultValues: {
      ...voidPermitData,
      revoke: true,
    },
    reValidateMode: "onChange",
  });

  const { control, handleSubmit, getValues } = formMethods;

  const handleCancel = () => onClose();

  const handleRevoke = () => {
    const revokeFormData = getValues();
    onRevoke(revokeFormData);
  };

  const revokeReasonRules = {
    required: {
      value: true,
      message: requiredMessage(),
    },
  };

  return (
    <Dialog className="revoke-dialog" open={showDialog} onClose={handleCancel}>
      <div className="revoke-dialog__header">
        <div className="revoke-dialog__icon">
          <FontAwesomeIcon className="icon" icon={faExclamationCircle} />
        </div>
        <span className="revoke-dialog__title">
          Are you sure you want to revoke this permit?
        </span>
      </div>
      <div className="revoke-dialog__body revoke-form">
        <FormProvider {...formMethods}>
          <div className="revoke-form__msg">
            Revoking a permit is a severe action that cannot be reversed. There
            are no refunds for revoked permits.
          </div>
          <Controller
            name="reason"
            control={control}
            rules={revokeReasonRules}
            render={({ fieldState: { invalid } }) => (
              <FormControl
                className="revoke-control revoke-control--reason"
                error={invalid}
              >
                <FormLabel className="revoke-control__label">
                  Reason for revoking
                </FormLabel>
                <CustomFormComponent
                  type="textarea"
                  feature={FEATURE}
                  options={{
                    name: "reason",
                    rules: revokeReasonRules,
                    width: "100%",
                  }}
                />
              </FormControl>
            )}
          />
          <div className="revoke-form__btns">
            <Button
              key="cancel-revoke-button"
              aria-label="Cancel"
              variant="contained"
              color="tertiary"
              className="revoke-permit-button revoke-permit-button--cancel"
              onClick={handleCancel}
              data-testid="cancel-revoke-permit-button"
            >
              Cancel
            </Button>
            <Button
              key="revoke-permit-button"
              aria-label="Revoke Permit"
              onClick={handleSubmit(handleRevoke)}
              className="revoke-permit-button revoke-permit-button--revoke"
              data-testid="revoke-permit-button"
            >
              Revoke Permit
            </Button>
          </div>
        </FormProvider>
      </div>
    </Dialog>
  );
};
