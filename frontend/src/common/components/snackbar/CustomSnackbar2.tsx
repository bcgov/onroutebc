import { Alert, IconButton, Snackbar } from "@mui/material";
import { useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { t } from "i18next";

/**
 * Type for displaying snackbar (aka toast message) after an operation.
 */
export interface DisplaySnackBarOptions {
  display: boolean;
  messageI18NKey: string;
  isError: boolean;
}

/**
 * Displays a snackbar.
 * @param snackBarStatus - Object of type DisplaySnackBarOptions
 * @param setSnackBarStatus - setState variable to set snackBarStatus options.
 */
export const CustomSnackbar2 = ({
  snackBarStatus,
  setSnackBarStatus,
}: {
  snackBarStatus: DisplaySnackBarOptions;
  setSnackBarStatus: React.Dispatch<
    React.SetStateAction<DisplaySnackBarOptions>
  >;
}) => {
  const vertical = "top";
  const horizontal = "right";

  /**
   * Clears the state of snackbar and closes it.
   */
  const closeSnackBar = useCallback(
    () =>
      setSnackBarStatus({
        display: false,
        isError: false,
        messageI18NKey: "",
      }),
    []
  );

  return (
    <Snackbar
      anchorOrigin={{ vertical: vertical, horizontal: horizontal }}
      open={snackBarStatus.display}
      onClose={closeSnackBar}
      action={
        <>
          <IconButton
            aria-label="close"
            color="inherit"
            sx={{ p: 0.5 }}
            onClick={closeSnackBar}
          >
            <CloseIcon />
          </IconButton>
        </>
      }
      key="manage-vehicle-snackbar"
    >
      <Alert
        onClose={closeSnackBar}
        severity={snackBarStatus.isError ? "error" : "success"}
        sx={{ width: "100%" }}
      >
        {t(snackBarStatus.messageI18NKey)}
      </Alert>
    </Snackbar>
  );
};
