import { Button, Dialog } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FormProvider, useForm } from "react-hook-form";

import "./SuspendModal.scss";
import { requiredMessage } from "../../../../common/helpers/validationMessages";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import { ORBC_FORM_FEATURES } from "../../../../common/types/common";

export const SuspendModal = ({
  showModal,
  onCancel,
  onConfirm,
}: {
  showModal: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) => {
  const formMethods = useForm<{ comment: string }>({
    defaultValues: {
      comment: "",
    },
    reValidateMode: "onChange",
  });

  const { handleSubmit, getValues } = formMethods;

  const handleCancel = () => onCancel();

  const handleSuspend = () => {
    const { comment } = getValues();
    onConfirm(comment);
  };

  const suspendReasonRules = {
    required: {
      value: true,
      message: requiredMessage(),
    },
  };

  return (
    <Dialog
      className="suspend-modal"
      open={showModal}
      onClose={handleCancel}
      PaperProps={{
        className: "suspend-modal__container",
      }}
    >
      <div className="suspend-modal__header">
        <div className="suspend-modal__icon">
          <FontAwesomeIcon className="icon" icon={faExclamationCircle} />
        </div>

        <span className="suspend-modal__title">Suspend this company?</span>
      </div>

      <FormProvider {...formMethods}>
        <div className="suspend-modal__body">
          <div className="suspend-form">
            <CustomFormComponent
              type="textarea"
              feature={ORBC_FORM_FEATURES.SUSPEND_ACCOUNT}
              options={{
                label: "Reason for Suspension",
                name: "comment",
                rules: suspendReasonRules,
              }}
              className="suspend-form__input"
            />
          </div>
        </div>

        <div className="suspend-modal__footer">
          <Button
            key="cancel-suspend-button"
            aria-label="Cancel"
            variant="contained"
            color="tertiary"
            className="suspend-button suspend-button--cancel"
            onClick={handleCancel}
            data-testid="cancel-suspend-button"
          >
            Cancel
          </Button>

          <Button
            key="suspend-button"
            aria-label="Suspend Company"
            onClick={handleSubmit(handleSuspend)}
            className="suspend-button suspend-button--suspend"
            data-testid="suspend-button"
          >
            Suspend Company
          </Button>
        </div>
      </FormProvider>
    </Dialog>
  );
};
