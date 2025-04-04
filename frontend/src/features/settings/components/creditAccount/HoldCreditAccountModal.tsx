import { Button, Dialog } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FormProvider, useForm } from "react-hook-form";
import { requiredMessage } from "../../../../common/helpers/validationMessages";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import {
  UPDATE_STATUS_ACTIONS,
  UpdateStatusData,
} from "../../types/creditAccount";
import "./HoldCreditAccountModal.scss";
import { ORBC_FORM_FEATURES } from "../../../../common/types/common";

export const HoldCreditAccountModal = ({
  showModal,
  onCancel,
  onConfirm,
  isPending,
}: {
  showModal: boolean;
  onCancel: () => void;
  onConfirm: (updateStatusData: UpdateStatusData) => void;
  isPending: boolean;
}) => {
  const formMethods = useForm<{ comment: string }>({
    defaultValues: {
      comment: "",
    },
    reValidateMode: "onChange",
  });

  const { handleSubmit, getValues } = formMethods;

  const handleCancel = () => onCancel();

  const handleHoldAccount = async () => {
    const { comment } = getValues();
    onConfirm({
      updateStatusAction: UPDATE_STATUS_ACTIONS.HOLD_CREDIT_ACCOUNT,
      reason: comment,
    });
  };

  const holdAccountCommentRules = {
    required: {
      value: true,
      message: requiredMessage(),
    },
  };

  return (
    <Dialog
      className="hold-account-modal"
      open={showModal}
      onClose={handleCancel}
      PaperProps={{
        className: "hold-account-modal__container",
      }}
    >
      <div className="hold-account-modal__header">
        <div className="hold-account-modal__icon">
          <FontAwesomeIcon className="icon" icon={faExclamationTriangle} />
        </div>

        <span className="hold-account-modal__title">Put Account on Hold</span>
      </div>

      <FormProvider {...formMethods}>
        <div className="hold-account-modal__body">
          <div className="hold-account-form">
            <CustomFormComponent
              className="hold-account-form__input"
              type="textarea"
              feature={ORBC_FORM_FEATURES.HOLD_CREDIT_ACCOUNT}
              options={{
                label: "Reason for Account Hold",
                name: "comment",
                rules: holdAccountCommentRules,
              }}
            />
          </div>
        </div>

        <div className="hold-account-modal__footer">
          <Button
            className="hold-account-modal__button hold-account-modal__button--cancel"
            key="cancel-hold-account-button"
            aria-label="Cancel"
            variant="contained"
            onClick={handleCancel}
            data-testid="cancel-hold-account-button"
          >
            Cancel
          </Button>

          <Button
            key="hold-account-button"
            aria-label="Hold-account Company"
            onClick={handleSubmit(handleHoldAccount)}
            className="hold-account-modal__button hold-account-modal__button--confirm"
            data-testid="hold-account-button"
            disabled={isPending}
          >
            Put on Hold
          </Button>
        </div>
      </FormProvider>
    </Dialog>
  );
};
