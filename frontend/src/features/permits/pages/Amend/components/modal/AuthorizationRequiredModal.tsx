import { Button, Dialog } from "@mui/material";
import "./AuthorizationRequiredModal.scss";
import { SuccessBcGovBanner } from "../../../../../../common/components/banners/SuccessBcGovBanner";
import { Nullable } from "../../../../../../common/types/common";

export const AuthorizationRequiredModal = ({
  isOpen,
  onCancel,
  onConfirm,
  permitNumber,
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
  permitNumber: Nullable<string>;
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      className="authorization-required-modal"
      PaperProps={{
        className: "authorization-required-modal__container",
      }}
    >
      <div className="authorization-required-modal__header header">
        <h2 className="header__text">Authorization Required</h2>
      </div>
      <div className="authorization-required-modal__banner">
        <SuccessBcGovBanner
          className="authorization-required-modal__banner"
          msg="Your changes have been saved"
        />
      </div>
      <div className="authorization-required-modal__subheader subheader">
        <h2 className="subheader__text">Amending Permit #: {permitNumber}</h2>
      </div>

      <div className="authorization-required-modal__body">
        <p className="authorization-required-modal__text">
          This amendment results in a refund.
          <br></br>
          <br></br>
          Note the Amending Permit # and inform authorized staff to process the
          refund.
        </p>
      </div>

      <div className="authorization-required-modal__footer">
        <Button
          className="authorization-required-modal__button"
          variant="contained"
          color="secondary"
          onClick={onConfirm}
        >
          Exit
        </Button>
      </div>
    </Dialog>
  );
};
