import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

import "./DeleteConfirmationDialog.scss";
import { Nullable } from "../../types/common";

/**
 * Confirmation dialog box for delete operations.
 */
export const DeleteConfirmationDialog = ({
  showDialog,
  onDelete,
  onCancel,
  itemToDelete,
  confirmationMsg = "Are you sure you want to delete this? This action cannot be undone.",
}: {
  showDialog: boolean;
  onDelete: () => void;
  onCancel: () => void;
  itemToDelete: string;
  confirmationMsg?: Nullable<string>;
}) => {
  return (
    <Dialog
      className="delete-confirmation-dialog"
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      open={showDialog}
      classes={{
        paper: "delete-confirmation-dialog__container",
      }}
    >
      <DialogTitle className="delete-confirmation-dialog__header">
        <span className="delete-confirmation-dialog__icon">
          <FontAwesomeIcon icon={faTrashCan} />
        </span>

        <span className="delete-confirmation-dialog__title">
          Delete {itemToDelete}(s)?
        </span>
      </DialogTitle>

      <DialogContent className="delete-confirmation-dialog__content" dividers>
        <Typography className="delete-confirmation-dialog__msg" gutterBottom>
          {confirmationMsg}
        </Typography>
      </DialogContent>

      <DialogActions className="delete-confirmation-dialog__actions">
        <Button
          className="delete-confirmation-dialog__btn delete-confirmation-dialog__btn--cancel"
          variant="contained"
          color="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          className="delete-confirmation-dialog__btn delete-confirmation-dialog__btn--delete"
          variant="contained"
          color="error"
          onClick={onDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
