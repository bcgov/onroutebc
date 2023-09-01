import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button, Dialog } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

import "./RevokeDialog.scss";
import { VoidPermitDto } from "../types/VoidPermitDto";

export const RevokeDialog = ({
  voidPermitData,
  showDialog,
  onClose,
}: {
  voidPermitData: VoidPermitDto;
  showDialog: boolean;
  onClose: () => void;
}) => {
  const formMethods = useForm<VoidPermitDto>({
    defaultValues: {
      ...voidPermitData,
      revoke: true,
    },
    reValidateMode: "onBlur",
  });

  const { control, setValue, handleSubmit, getValues } = formMethods;

  const handleReasonChange = (reason: string) => {
    setValue("reason", reason);
  };

  const handleCancel = () => onClose();

  const handleRevoke = () => {
    const revokeFormData = getValues();
    console.log("Revoke"); //
    console.log(revokeFormData); //
  };

  return (
    <Dialog 
      className="revoke-dialog"
      open={showDialog}
      onClose={handleCancel}
    >
      <div className="revoke-dialog__header">
        <div className="revoke-dialog__icon">
          <FontAwesomeIcon
            className="icon"
            icon={faExclamationCircle}
          />
        </div>
        <span className="revoke-dialog__title">
          Are you sure you want to revoke this permit?
        </span>
      </div>
      <div className="revoke-dialog__body revoke-form">
        <FormProvider {...formMethods}>
          <div className="revoke-form__msg">
            Revoking a permit is a severe action that cannot be reversed. There are no refunds for revoked permits.
          </div>
          <div className="revoke-form__label">Reason for revoking</div>
          <Controller
            name="reason"
            control={control}
            render={({ field: { value }}) => (
              <textarea 
                name="reason" 
                className="revoke-form__reason"
                rows={6}
                defaultValue={value}
                onChange={(e) => handleReasonChange(e.target.value)}
              >
              </textarea>
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
