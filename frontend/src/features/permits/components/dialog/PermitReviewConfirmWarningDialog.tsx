import { Button, Dialog } from "@mui/material";

import "./PermitReviewConfirmWarningDialog.scss";

export const PermitReviewConfirmWarningDialog = ({
  showModal,
  isAmend,
  actionText,
  confirmButtonText,
  onConfirm,
  onCancel,
}: {
  showModal: boolean;
  isAmend: boolean;
  actionText: string;
  confirmButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const headerText = `${isAmend ? "Amendment" : "Application"} has violation(s) and/or warning(s)`;
  const bodyText =
    `I confirm that I have reviewed the violation(s) and/or warning(s) associated with this ` +
    `${isAmend ? "amendment" : "permit application"} and would like to ${actionText}.`;

  const handleConfirm = () => {
    onConfirm();
    onCancel();
  };

  return (
    <Dialog
      className="permit-review-confirm-warning-dialog"
      open={showModal}
      onClose={onCancel}
      PaperProps={{
        className: "permit-review-confirm-warning-dialog__container",
      }}
    >
      <div className="permit-review-confirm-warning-dialog__header">
        <span className="permit-review-confirm-warning-dialog__title">
          {headerText}
        </span>
      </div>

      <div className="permit-review-confirm-warning-dialog__body">
        <span className="permit-review-confirm-warning-dialog__text">
          {bodyText}
        </span>
      </div>

      <div className="permit-review-confirm-warning-dialog__footer">
        <Button
          className="permit-review-confirm-warning-dialog__button permit-review-confirm-warning-dialog__button--cancel"
          key="cancel-review-button"
          aria-label="Cancel"
          onClick={onCancel}
          data-testid="cancel-review-button"
        >
          Cancel
        </Button>

        <Button
          className="permit-review-confirm-warning-dialog__button permit-review-confirm-warning-dialog__button--confirm"
          key="confirm-review-button"
          aria-label={confirmButtonText}
          onClick={handleConfirm}
          data-testid="confirm-review-button"
        >
          {confirmButtonText}
        </Button>
      </div>
    </Dialog>
  );
};
