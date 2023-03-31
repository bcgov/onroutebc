import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";

/**
 *  Confirmation Dialog box for Delete Operations.
 */
export default function ConfirmationDialog({
  vehicleId,
  isOpen,
}: {
  vehicleId: string;
  isOpen: boolean;
}) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(() => false);
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="vehicle-confirmation-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{
            background: BC_COLOURS.bc_background_light_grey,
            color: BC_COLOURS.bc_red,
          }}
        >
          <i className="fa fa-trash"></i> &nbsp;
          <strong>Delete item(s)? </strong>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Are you sure you want to delete this? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleClose}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
