import { Alert, Snackbar } from "@mui/material";

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
  const horizontal = "right";

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
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
        sx={{ width: "100%", borderRadius: "40px" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
