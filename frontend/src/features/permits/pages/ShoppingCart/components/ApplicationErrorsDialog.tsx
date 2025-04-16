import { Button, Dialog } from "@mui/material";

import "./ApplicationErrorsDialog.scss";

export const ApplicationErrorsDialog = ({
  shouldOpen,
  handleClose,
}: {
  shouldOpen: boolean;
  handleClose: () => void;
}) => {
  return (
    <Dialog
      className="application-errors-dialog"
      onClose={handleClose}
      open={shouldOpen}
    >
      <div className="application-errors-dialog__header">
        <span className="application-errors-dialog__title">
          Application Errors
        </span>
      </div>

      <div className="application-errors-dialog__info">
        Applications in your shopping cart have errors. Please deselect or
        remove them to continue.
      </div>

      <div className="application-errors-dialog__actions">
        <Button
          className="application-errors-dialog__btn"
          variant="contained"
          color="primary"
          onClick={handleClose}
        >
          Close
        </Button>
      </div>
    </Dialog>
  );
};
