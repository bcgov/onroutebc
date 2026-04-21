import { Button, Dialog } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import "./RemovePowerUnitDialog.scss";

export const RemovePowerUnitDialog = ({
  isOpen,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog
      className="remove-power-unit-dialog"
      open={isOpen}
      onClose={onCancel}
      PaperProps={{
        className: "remove-power-unit-dialog__container",
      }}
    >
      <div className="remove-power-unit-dialog__header">
        <div className="remove-power-unit-dialog__icon">
          <FontAwesomeIcon className="icon" icon={faExclamationTriangle} />
        </div>

        <span className="remove-power-unit-dialog__title">
          Remove Power Unit
        </span>
      </div>

      <div className="remove-power-unit-dialog__body">
        Removing your power unit will require you to re-enter your trailer
        configuration and Axle Spacing and Weights.
      </div>

      <div className="remove-power-unit-dialog__footer">
        <Button
          className="remove-power-unit-dialog__button remove-power-unit-dialog__button--cancel"
          aria-label="Cancel"
          variant="contained"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          aria-label="Remove Power Unit"
          onClick={onConfirm}
          className="remove-power-unit-dialog__button remove-power-unit-dialog__button--continue"
        >
          Continue
        </Button>
      </div>
    </Dialog>
  );
};
