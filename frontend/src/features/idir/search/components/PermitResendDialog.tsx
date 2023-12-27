import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormLabel, Grid, OutlinedInput } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";

/**
 *  A dialog box for resending permit by email or fax.
 */
export default function PermitResendDialog({
  isOpen,
  onClickResend,
  onClickCancel,
  email,
  fax,
  permitNumber,
}: Readonly<{
  /**
   * Boolean to control the open and close state of Dialog box.
   */
  isOpen: boolean;
  /**
   * A callback function on clicking resend button.
   * @returns void
   */
  onClickResend?: () => void;

  /**
   * A callback function on clicking cancel button.
   * @returns void
   */
  onClickCancel?: () => void;
  /**
   * The permit number to be displayed in the dialog box.
   */
  permitNumber: string;
  /**
   * The email address if available.
   */
  email?: string;
  /**
   * The fax if available.
   */
  fax?: string;
}>) {
  const [emailState, setEmailState] = useState<string>(email ?? "");
  const [faxState, setFaxState] = useState<string>(fax ?? "");
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
            color: BC_COLOURS.bc_black,
          }}
        >
          <FontAwesomeIcon icon={faEnvelope} /> &nbsp;
          <strong>Resend Permit and Receipt</strong>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {<strong>Permit #: {permitNumber}</strong>}
          </Typography>
          <br />
          <Grid container>
            <Grid xs={12} item>
              <FormLabel>
                <strong>Email</strong>
              </FormLabel>
              <br />
              <OutlinedInput
                name="email"
                value={emailState}
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: BC_COLOURS.focus_blue,
                  },
                }}
                style={{ width: "100%" }}
                onChange={(event) => {
                  setEmailState(() => event.target?.value);
                }}
              />
            </Grid>
            <Grid xs={12} item>
              <FormLabel>
                <strong>Fax</strong>
              </FormLabel>
              <br />
              <OutlinedInput
                name="fax"
                value={faxState}
                style={{ width: "100%" }}
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: BC_COLOURS.focus_blue,
                  },
                }}
                onChange={(event) => {
                  setFaxState(() => event.target?.value);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={onClickCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onClickResend}>
            Resend
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
