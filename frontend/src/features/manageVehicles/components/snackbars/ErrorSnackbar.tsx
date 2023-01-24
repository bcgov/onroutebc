import { Alert, Snackbar } from "@mui/material";

export const ErrorSnackbar = ({
    showErrorSnackbar,
    setShowErrorSnackbar,
    errorMessage
}: {
    showErrorSnackbar: boolean;
    setShowErrorSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
    errorMessage: string;
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
    setShowErrorSnackbar(false);
  };

  return (
    <Snackbar
      open={showErrorSnackbar}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {errorMessage}
      </Alert>
    </Snackbar>
  );
};
