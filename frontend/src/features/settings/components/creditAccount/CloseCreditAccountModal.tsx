import { Button, Dialog } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FormProvider, useForm } from "react-hook-form";

import "./CloseCreditAccountModal.scss";
import { requiredMessage } from "../../../../common/helpers/validationMessages";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";

export const CloseCreditAccountModal = ({
  showModal,
  onCancel,
  onConfirm,
}: {
  showModal: boolean;
  onCancel: () => void;
  onConfirm: (comment: string) => void;
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
    onConfirm(comment);
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
            By closing this credit account the Account Holder and Account Users
            can’t use this credit account.
          </span>
          <span className="close-account-modal__text">
            Are you sure you want to continue?
          </span>
          <div className="close-account-form">
            <CustomFormComponent
              type="textarea"
              feature="close-account-comment"
              options={{
                label: "Comment for Account Closure",
                name: "comment",
                rules: closeAccountCommentRules,
              }}
              className="close-account-form__input"
            />
          </div>
        </div>

        <div className="close-account-modal__footer">
          <Button
            key="cancel-close-account-button"
            aria-label="Cancel"
            variant="contained"
            className="close-account-button close-account-button--cancel"
            onClick={handleCancel}
            data-testid="cancel-close-account-button"
          >
            Cancel
          </Button>

          <Button
            key="close-account-button"
            aria-label="Close-account Company"
            onClick={handleSubmit(handleCloseAccount)}
            className="close-account-button close-account-button--close-account"
            data-testid="close-account-button"
          >
            Close Credit Account
          </Button>
        </div>
      </FormProvider>
    </Dialog>
  );
};
