import { Button, Dialog } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { requiredMessage } from "../../../../common/helpers/validationMessages";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import "./VerifyCreditAccountModal.scss";
import { ORBC_FORM_FEATURES } from "../../../../common/types/common";

export const VerifyCreditAccountModal = ({
  showModal,
  onCancel,
  onConfirm,
  isPending,
}: {
  showModal: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
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

  const handleVerifyAccount = async () => {
    const { comment } = getValues();
    onConfirm(comment);
  };

  const verifyAccountCommentRules = {
    required: {
      value: true,
      message: requiredMessage(),
    },
  };

  return (
    <Dialog
      className="verify-account-modal"
      open={showModal}
      onClose={handleCancel}
      PaperProps={{
        className: "verify-account-modal__container",
      }}
    >
      <div className="verify-account-modal__header">
        <span className="verify-account-modal__title">Verify Account</span>
      </div>

      <FormProvider {...formMethods}>
        <div className="verify-account-modal__body">
          <div className="verify-account-form">
            <CustomFormComponent
              className="verify-account-form__input"
              type="textarea"
              feature={ORBC_FORM_FEATURES.HOLD_CREDIT_ACCOUNT}
              options={{
                label: "Reason for Account Verification",
                name: "comment",
                rules: verifyAccountCommentRules,
              }}
            />
          </div>
        </div>

        <div className="verify-account-modal__footer">
          <Button
            className="verify-account-modal__button verify-account-modal__button--cancel"
            key="cancel-verify-account-button"
            aria-label="Cancel"
            variant="contained"
            onClick={handleCancel}
            data-testid="cancel-verify-account-button"
          >
            Cancel
          </Button>

          <Button
            key="verify-account-button"
            aria-label="verify-account Company"
            onClick={handleSubmit(handleVerifyAccount)}
            className="verify-account-modal__button verify-account-modal__button--confirm"
            data-testid="verify-account-button"
            disabled={isPending}
          >
            Verify Account
          </Button>
        </div>
      </FormProvider>
    </Dialog>
  );
};
