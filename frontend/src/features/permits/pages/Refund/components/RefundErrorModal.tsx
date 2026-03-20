import { Button, Dialog } from "@mui/material";
import "./RefundErrorModal.scss";
import { Nullable } from "../../../../../common/types/common";

export const RefundErrorModal = ({
  isOpen,
  onCancel,
  onConfirm,
  message,
}: {
  /**
   * Boolean to control the open and close state of Dialog box.
   */
  isOpen: boolean;
  /**
   * A callback function on clicking cancel button.
   * @returns void
   */
  onCancel: () => void;
  onConfirm: () => void;
  message: Nullable<string>;
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      className="refund-error-modal"
      PaperProps={{
        className: "refund-error-modal__container",
      }}
    >
      <div className="refund-error-modal__header">
        <h2 className="refund-error-modal__title">Refund Error</h2>
      </div>

      <div className="refund-error-modal__body">
        <p className="refund-error-modal__text">{message}</p>
      </div>

      <div className="refund-error-modal__footer">
        <Button
          className="refund-error-modal__button"
          variant="contained"
          color="primary"
          onClick={onConfirm}
        >
          Close
        </Button>
      </div>
    </Dialog>
  );
};
