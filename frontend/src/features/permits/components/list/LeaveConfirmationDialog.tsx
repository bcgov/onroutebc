import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";

/**
 *  A stateless confirmation dialog box for Delete Operations.
 */
export default function LeaveConfirmationDialog({
  isOpen,
  onClickLeave,
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
  onClickLeave: () => void;

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
}) {
  const title = caption;
  return (
    <div>
      <Dialog
        onClose={onClickCancel}
        aria-labelledby="confirmation-dialog-title"
        open={isOpen}
      >
        <DialogTitle
          sx={{
            background: BC_COLOURS.bc_background_light_grey,
            color: BC_COLOURS.bc_brown,
          }}
        >
          <i className="fa fa-exclamation-triangle"></i> &nbsp;
          <strong>Are you sure you want to leave? </strong>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
          You have unsaved changes. If you leave, all your changes will be lost. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={onClickCancel}>
            Discard Changes
          </Button>
          <Button variant="contained" className="btn btn-primary" onClick={onClickLeave}>
            Continue Editing
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
