import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import "./DeleteConfirmationDialog.scss";

/**
 *  A stateless confirmation dialog box for Delete Operations.
 */
export const DeleteConfirmationDialog = ({
  isOpen,
  onClickDelete,
  onClickCancel,
  caption,
}: {
  /**
   * Boolean to control the open and close state of Dialog box.
   */
  isOpen: boolean;
  /**
   * A callback function on clicking delete button.
   * @returns void
   */
  onClickDelete: () => void;

  /**
   * A callback function on clicking cancel button.
   * @returns void
   */
  onClickCancel: () => void;
  /**
   * A caption string showing on title of the Dialog box.
   * @returns string
   */
  caption: string
}) => {
  const title = caption;

  return (
    <div>
      <Dialog
        className="delete-confirmation-dialog"
        onClose={onClickCancel}
        aria-labelledby="confirmation-dialog-title"
        open={isOpen}
      >
        <DialogTitle
          className="delete-confirmation-dialog__title"
        >
          <span className="delete-confirmation-dialog__icon">
            <FontAwesomeIcon icon={faTrashCan} />
          </span> &nbsp;
          <strong>Delete {title}(s)? </strong>
        </DialogTitle>

        <DialogContent
          className="delete-confirmation-dialog__content"
          dividers
        >
          <Typography 
            className="delete-confirmation-dialog__msg" 
            gutterBottom
          >
            Are you sure you want to delete this? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions className="delete-confirmation-dialog__actions">
          <Button
            className="delete-confirmation-btn delete-confirmation-btn--cancel"
            variant="contained" 
            color="secondary" 
            onClick={onClickCancel}
          >
            Cancel
          </Button>

          <Button
            className="delete-confirmation-btn delete-confirmation-btn--delete"
            variant="contained" 
            color="error" 
            onClick={onClickDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
