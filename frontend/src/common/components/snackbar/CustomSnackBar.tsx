import { Alert, Snackbar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faCheckCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { BC_COLOURS } from "../../../themes/bcGovStyles";

/**
 * Type for displaying snackbar (aka toast message) after an operation.
 */
export interface SnackBarOptions {
  showSnackbar: boolean;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  alertType: "info" | "error" | "success";
}

/**
 * Displays a snackbar.
 * @param showSnackbar - boolean indicating if the snackbar should be displayed.
 * @param setShowSnackbar - setState variable to set if the snackbar should be displayed.
 * @param message - string containing the message.
 * @param isError - boolean indicating if the snackbar expresses an error.
 */
export const CustomSnackbar = ({
  showSnackbar,
  setShowSnackbar,
  message,
  alertType,
}: SnackBarOptions) => {
  const vertical = "top";
  const horizontal = "center";

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar(false);
  };

  return (
    <Snackbar
      open={showSnackbar}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert
        onClose={handleClose}
        severity={alertType}
        sx={{
          boxShadow: "0 0 1rem #31313229",
        }}
        // hide close button
        action={<></>}
        iconMapping={{
          success: (
            <FontAwesomeIcon
              icon={faCheckCircle}
              color={BC_COLOURS.bc_messages_green_text}
            />
          ),
          info: (
            <FontAwesomeIcon
              icon={faInfoCircle}
              color={BC_COLOURS.bc_primary_blue}
            />
          ),
          error: (
            <FontAwesomeIcon
              icon={faExclamationCircle}
              color={BC_COLOURS.bc_messages_red_text}
            />
          ),
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
