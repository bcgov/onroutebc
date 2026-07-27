import { Button, Dialog } from "@mui/material";
import "./EGARMSRefundErrorModal.scss";
import { getEGARMSErrorMessage } from "../../../../settings/helpers/creditAccount";
import {
  CVSE_REVENUE_EMAIL,
  CVSE_REVENUE_PHONE,
} from "../../../../../common/constants/constants";
import { Nullable } from "../../../../../common/types/common";

export const EGARMSRefundErrorModal = ({
  isOpen,
  onCancel,
  onConfirm,
  creditAccountEgarmsError,
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
  creditAccountEgarmsError: Nullable<string>;
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      className="egarms-refund-error-modal"
      PaperProps={{
        className: "egarms-refund-error-modal__container",
      }}
    >
      <div className="egarms-refund-error-modal__header">
        <h2 className="egarms-refund-error-modal__title">
          Refund can&apos;t be processed
        </h2>
      </div>

      <div className="egarms-refund-error-modal__body">
        <div className="egarms-refund-error-modal__text">
          Refunds can’t be processed for Credit Accounts with{" "}
          <span className="egarms-refund-error-modal__test--egarms-error-code">
            eGARMS Return Code {creditAccountEgarmsError}:{" "}
            {getEGARMSErrorMessage(creditAccountEgarmsError)}
          </span>
          <br />
          <br />
          Please contact CVSE Revenue.{" "}
          <span className="egarms-refund-error-modal__text--contact">
            Phone: {CVSE_REVENUE_PHONE}
          </span>{" "}
          or{" "}
          <span className="egarms-refund-error-modal__text--contact">
            Email: {CVSE_REVENUE_EMAIL}
          </span>
        </div>
      </div>

      <div className="egarms-refund-error-modal__footer">
        <Button
          className="egarms-refund-error-modal__button"
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
