import { Button, Dialog } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FormProvider, useForm } from "react-hook-form";
import { requiredMessage } from "../../../../common/helpers/validationMessages";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import "./CloseCreditAccountModal.scss";
import {
  UPDATE_STATUS_ACTIONS,
  UpdateStatusData,
} from "../../types/creditAccount";
import { ORBC_FORM_FEATURES } from "../../../../common/types/common";

export const CloseCreditAccountModal = ({
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

  const handleCloseAccount = () => {
    const { comment } = getValues();
    onConfirm({
      updateStatusAction: UPDATE_STATUS_ACTIONS.CLOSE_CREDIT_ACCOUNT,
      reason: comment,
    });
  };

  const closeAccountCommentRules = {
    required: {
      value: true,
      message: requiredMessage(),
    },
  };

  return (
    <Dialog
      className="close-account-modal"
      open={showModal}
      onClose={handleCancel}
      PaperProps={{
        className: "close-account-modal__container",
      }}
    >
      <div className="close-account-modal__header">
        <div className="close-account-modal__icon">
          <FontAwesomeIcon className="icon" icon={faCircleXmark} />
        </div>

        <span className="close-account-modal__title">Close Credit Account</span>
      </div>

      <FormProvider {...formMethods}>
        <div className="close-account-modal__body">
          <span className="close-account-modal__text">
            Closing this credit account will prevent the Account Holder from
            using it and remove Account Users from the account.
          </span>
          <span className="close-account-modal__text">
            Are you sure you want to continue?
          </span>
          <div className="close-account-form">
            <CustomFormComponent
              type="textarea"
              feature={ORBC_FORM_FEATURES.CLOSE_CREDIT_ACCOUNT}
              options={{
                label: "Reason for Account Closure",
                name: "comment",
                rules: closeAccountCommentRules,
              }}
              className="close-account-form__input"
            />
          </div>
        </div>

        <div className="close-account-modal__footer">
          <Button
            className="close-account-modal__button close-account-modal__button--cancel"
            key="cancel-close-account-button"
            aria-label="Cancel"
            variant="contained"
            onClick={handleCancel}
            data-testid="cancel-close-account-button"
          >
            Cancel
          </Button>

          <Button
            className="close-account-modal__button close-account-modal__button--confirm"
            key="close-account-button"
            aria-label="Close-account Company"
            onClick={handleSubmit(handleCloseAccount)}
            data-testid="close-account-button"
            disabled={isPending}
          >
            Close Credit Account
          </Button>
        </div>
      </FormProvider>
    </Dialog>
  );
};
