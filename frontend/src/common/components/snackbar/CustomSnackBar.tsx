import { Alert, Snackbar } from "@mui/material";

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
  isError,
}: {
  showSnackbar: boolean;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  isError: boolean;
}) => {
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
        severity={isError ? "error" : "success"}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
